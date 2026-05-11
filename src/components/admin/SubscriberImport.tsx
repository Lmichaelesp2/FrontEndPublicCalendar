'use client';
import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader } from 'lucide-react';
import { supabaseAdmin } from '../../lib/supabase';

// ── Types ─────────────────────────────────────────────────────────────────────

type ImportRow = {
  email: string;
  first_name: string | null;
  last_name: string | null;
  city: string;
  status: string;
  source: string;
  active_subscription: string;
  subscribed_at: string | null;
  migrated_from_id: number | null;
  _rowNum: number;
  _error?: string;
};

type ImportResult = {
  inserted: number;
  skipped: number;
  errors: { email: string; reason: string }[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_CITIES = ['San Antonio', 'Austin', 'Dallas', 'Houston'];

const CITY_ALIASES: Record<string, string> = {
  'san antonio': 'San Antonio',
  'sa':          'San Antonio',
  'austin':      'Austin',
  'dallas':      'Dallas',
  'houston':     'Houston',
};

function normalizeCity(raw: string): string | null {
  const key = raw.trim().toLowerCase();
  return CITY_ALIASES[key] ?? null;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text: string): ImportRow[] {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9_]/g, '_'));

  const get = (row: string[], key: string): string => {
    const idx = headers.indexOf(key);
    return idx >= 0 ? (row[idx] ?? '').trim() : '';
  };

  const rows: ImportRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const email = get(cols, 'email').toLowerCase();
    const rawCity = get(cols, 'city');
    const city = normalizeCity(rawCity);
    const firstName = get(cols, 'first_name') || null;
    const lastName = get(cols, 'last_name') || null;
    const createdAt = get(cols, 'created_at') || null;
    const oldId = get(cols, 'old_id');
    const status = get(cols, 'active_subscription') || 'trial';

    const row: ImportRow = {
      email,
      first_name: firstName,
      last_name: lastName,
      city: city ?? rawCity,
      status: 'active',
      active_subscription: status || 'trial',
      source: 'import',
      subscribed_at: createdAt,
      migrated_from_id: oldId ? parseInt(oldId) : null,
      _rowNum: i,
    };

    if (!email || !email.includes('@')) {
      row._error = 'Invalid or missing email';
    } else if (!city) {
      row._error = `Unrecognized city: "${rawCity}"`;
    }

    rows.push(row);
  }

  return rows;
}

// ── Main Component ────────────────────────────────────────────────────────────

export function SubscriberImport({ onImportComplete }: { onImportComplete: () => void }) {
  const [dragActive, setDragActive]   = useState(false);
  const [parsed, setParsed]           = useState<ImportRow[] | null>(null);
  const [fileName, setFileName]       = useState('');
  const [importing, setImporting]     = useState(false);
  const [result, setResult]           = useState<ImportResult | null>(null);
  const [parseError, setParseError]   = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const validRows   = parsed?.filter(r => !r._error) ?? [];
  const invalidRows = parsed?.filter(r => r._error)  ?? [];

  // City breakdown for preview
  const cityBreakdown = VALID_CITIES.map(c => ({
    city: c,
    count: validRows.filter(r => r.city === c).length,
  })).filter(c => c.count > 0);

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function processFile(file: File) {
    setParseError('');
    setResult(null);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const rows = parseCSV(text);
        if (rows.length === 0) {
          setParseError('No data found. Make sure your CSV has headers and at least one row.');
          return;
        }
        setParsed(rows);
      } catch (err) {
        setParseError('Failed to parse CSV. Make sure it is a valid comma-separated file.');
      }
    };
    reader.readAsText(file);
  }

  function reset() {
    setParsed(null);
    setFileName('');
    setResult(null);
    setParseError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  async function runImport() {
    if (!validRows.length) return;
    setImporting(true);

    const inserted: number[] = [];
    const errors: { email: string; reason: string }[] = [];
    let skipped = 0;

    // Batch import in chunks of 50
    const CHUNK = 50;
    for (let i = 0; i < validRows.length; i += CHUNK) {
      const chunk = validRows.slice(i, i + CHUNK);

      // Check for existing email+city combos
      const emails = [...new Set(chunk.map(r => r.email))];
      const { data: existing } = await supabaseAdmin
        .from('newsletter_subscriptions')
        .select('email, city')
        .in('email', emails);

      const existingSet = new Set(
        (existing ?? []).map((r: { email: string; city: string }) => `${r.email}|${r.city}`)
      );

      const toInsert = chunk.filter(r => !existingSet.has(`${r.email}|${r.city}`));
      const dupes    = chunk.length - toInsert.length;
      skipped       += dupes;

      if (toInsert.length > 0) {
        const records = toInsert.map(r => ({
          email:             r.email,
          first_name:        r.first_name,
          last_name:         r.last_name,
          city:              r.city,
          status:            r.status,
          active_subscription: r.active_subscription,
          source:            r.source,
          subscribed_at:     r.subscribed_at,
          migrated_from_id:  r.migrated_from_id,
        }));

        const { error } = await supabaseAdmin
          .from('newsletter_subscriptions')
          .insert(records);

        if (error) {
          toInsert.forEach(r => errors.push({ email: r.email, reason: error.message }));
        } else {
          inserted.push(...toInsert.map((_, idx) => idx));
        }
      }
    }

    setResult({ inserted: inserted.length, skipped, errors });
    setImporting(false);
    if (inserted.length > 0) onImportComplete();
  }

  // ── Render: Success ──────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="sub-import">
        <div className="sub-import-result">
          <CheckCircle size={40} className="sub-import-result-icon success" />
          <h3>Import Complete</h3>
          <div className="sub-import-result-stats">
            <div className="sub-import-stat success">
              <span className="sub-import-stat-val">{result.inserted.toLocaleString()}</span>
              <span className="sub-import-stat-lbl">Imported</span>
            </div>
            <div className="sub-import-stat neutral">
              <span className="sub-import-stat-val">{result.skipped.toLocaleString()}</span>
              <span className="sub-import-stat-lbl">Skipped (duplicates)</span>
            </div>
            <div className="sub-import-stat error">
              <span className="sub-import-stat-val">{result.errors.length}</span>
              <span className="sub-import-stat-lbl">Errors</span>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div className="sub-import-errors">
              <p><strong>Failed rows:</strong></p>
              {result.errors.slice(0, 10).map((e, i) => (
                <p key={i} className="sub-import-error-row">{e.email}: {e.reason}</p>
              ))}
              {result.errors.length > 10 && <p>…and {result.errors.length - 10} more</p>}
            </div>
          )}
          <button className="subs-filter-tab active" onClick={reset} style={{ marginTop: 24 }}>
            Import Another File
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Preview ──────────────────────────────────────────────────────
  if (parsed) {
    return (
      <div className="sub-import">
        <div className="sub-import-preview-header">
          <div className="sub-import-file-badge">
            <FileText size={16} />
            <span>{fileName}</span>
            <button onClick={reset} className="sub-import-remove"><X size={14} /></button>
          </div>
        </div>

        {/* Summary */}
        <div className="sub-import-summary">
          <div className="sub-import-stat success">
            <span className="sub-import-stat-val">{validRows.length.toLocaleString()}</span>
            <span className="sub-import-stat-lbl">Ready to import</span>
          </div>
          <div className="sub-import-stat error">
            <span className="sub-import-stat-val">{invalidRows.length}</span>
            <span className="sub-import-stat-lbl">Will be skipped</span>
          </div>
          {cityBreakdown.map(c => (
            <div key={c.city} className="sub-import-stat neutral">
              <span className="sub-import-stat-val">{c.count.toLocaleString()}</span>
              <span className="sub-import-stat-lbl">{c.city}</span>
            </div>
          ))}
        </div>

        {/* Invalid rows warning */}
        {invalidRows.length > 0 && (
          <div className="sub-import-warnings">
            <AlertCircle size={15} />
            <div>
              <strong>{invalidRows.length} rows will be skipped</strong> due to errors:
              {invalidRows.slice(0, 5).map(r => (
                <div key={r._rowNum} className="sub-import-warn-row">
                  Row {r._rowNum}: {r.email || '(no email)'} — {r._error}
                </div>
              ))}
              {invalidRows.length > 5 && <div>…and {invalidRows.length - 5} more</div>}
            </div>
          </div>
        )}

        {/* Preview table */}
        <div className="sub-import-table-wrap">
          <table className="subs-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>City</th>
                <th>Status</th>
                <th>Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {validRows.slice(0, 10).map((r, i) => (
                <tr key={i}>
                  <td className="subs-td-email">{r.email}</td>
                  <td>{r.first_name ?? <span className="subs-none">—</span>}</td>
                  <td>{r.city}</td>
                  <td><span className="subs-source-badge new">{r.active_subscription}</span></td>
                  <td className="subs-td-date">{r.subscribed_at ? new Date(r.subscribed_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {validRows.length > 10 && (
            <p className="sub-import-more">…and {(validRows.length - 10).toLocaleString()} more rows</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="sub-import-actions">
          <button className="subs-filter-tab" onClick={reset}>Cancel</button>
          <button
            className="btn-import-run"
            onClick={runImport}
            disabled={importing || validRows.length === 0}
          >
            {importing
              ? <><Loader size={15} className="spin" /> Importing…</>
              : <>Import {validRows.length.toLocaleString()} Subscribers</>
            }
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Upload dropzone ───────────────────────────────────────────────
  return (
    <div className="sub-import">
      <div
        className={`sub-import-dropzone${dragActive ? ' active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <Upload size={40} className="sub-import-dropzone-icon" />
        <p className="sub-import-dropzone-title">Drag & drop your CSV file here</p>
        <p className="sub-import-dropzone-sub">or click to browse</p>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>

      {parseError && (
        <div className="sub-import-warnings">
          <AlertCircle size={15} />
          <span>{parseError}</span>
        </div>
      )}

      <div className="sub-import-format-help">
        <FileText size={14} />
        <div>
          <strong>Required columns:</strong> email, city
          <br />
          <strong>Optional columns:</strong> first_name, last_name, created_at, old_id, active_subscription
          <br />
          <strong>Valid cities:</strong> San Antonio, Austin, Dallas, Houston
        </div>
      </div>
    </div>
  );
}
