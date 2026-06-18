'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Search, X, ChevronDown, ChevronUp, ArrowUpDown, LogOut, ArrowLeft, Pencil, Trash2, Upload, Crown } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { AdminLogin } from './AdminLogin';
import { SubscriberImport } from './SubscriberImport';

// ── Types ─────────────────────────────────────────────────────────────────────

type SubRow = {
  id: string;
  email: string;
  first_name: string | null;
  city: string | null;
  sub_calendar: string | null;
  status: string;
  source: string;
  created_at: string;
};

type Subscriber = {
  email: string;
  first_name: string | null;
  subscriptions: SubRow[];
  since: string;
};

type PremiumRow = {
  id: string;
  email: string;
  first_name: string | null;
  subscription_tier: string;
  subscription_status: string | null;
  stripe_customer_id: string | null;
  grace_period_ends_at: string | null;
  created_at: string;
  notes: string | null;
  city?: string | null;
};

type SortKey = 'name' | 'email' | 'count' | 'since';
type SortDir = 'asc' | 'desc';

// ── Helpers ───────────────────────────────────────────────────────────────────

const CITY_COLORS: Record<string, string> = {
  'Austin':      '#3b82f6',
  'Dallas':      '#8b5cf6',
  'Houston':     '#10b981',
  'San Antonio': '#f59e0b',
};

function calLabel(row: SubRow) {
  if (!row.city) return 'Unknown';
  if (!row.sub_calendar) return `${row.city} (city-wide)`;
  return `${row.city} — ${row.sub_calendar}`;
}

function calColor(row: SubRow) {
  return CITY_COLORS[row.city ?? ''] ?? '#6b7280';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

// All possible calendars a subscriber can be on
const ALL_CITIES = ['Austin', 'Dallas', 'Houston', 'San Antonio'];
const ALL_SUBCALS = ['Networking', 'Technology', 'Real Estate', 'Chamber', 'Small Business'];

// Every possible calendar combination (4 cities × 6 options each = 24)
const ALL_CALENDARS: { city: string; sub_calendar: string | null; label: string }[] = [];
for (const city of ALL_CITIES) {
  ALL_CALENDARS.push({ city, sub_calendar: null, label: `${city} (city-wide)` });
  for (const sub of ALL_SUBCALS) {
    ALL_CALENDARS.push({ city, sub_calendar: sub, label: `${city} — ${sub}` });
  }
}

function EditModal({ subscriber, onClose, onSave }: {
  subscriber: Subscriber;
  onClose: () => void;
  onSave: (
    oldEmail: string,
    newFirstName: string,
    newEmail: string,
    toAdd: { city: string; sub_calendar: string | null }[],
    toRemove: string[]
  ) => Promise<void>;
}) {
  const [firstName, setFirstName]   = useState(subscriber.first_name ?? '');
  const [email, setEmail]           = useState(subscriber.email);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [showAddPicker, setShowAddPicker] = useState(false);

  // Track which subscription rows to remove (by id)
  const [toRemove, setToRemove]     = useState<Set<string>>(new Set());
  // Track new calendars to add
  const [toAdd, setToAdd]           = useState<{ city: string; sub_calendar: string | null }[]>([]);

  // Existing subs not marked for removal
  const existingActive = subscriber.subscriptions.filter(r => !toRemove.has(r.id));

  // Calendars already subscribed to (active) — for filtering the picker
  const alreadySubbed = new Set(
    existingActive.map(r => `${r.city}|${r.sub_calendar ?? ''}`)
  );
  // Also exclude ones we've already added this session
  const alreadyAdded = new Set(
    toAdd.map(a => `${a.city}|${a.sub_calendar ?? ''}`)
  );

  const availableToAdd = ALL_CALENDARS.filter(
    c => !alreadySubbed.has(`${c.city}|${c.sub_calendar ?? ''}`) &&
         !alreadyAdded.has(`${c.city}|${c.sub_calendar ?? ''}`)
  );

  function toggleRemove(id: string) {
    setToRemove(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function addCalendar(cal: { city: string; sub_calendar: string | null }) {
    setToAdd(prev => [...prev, cal]);
    setShowAddPicker(false);
  }

  function removeFromToAdd(idx: number) {
    setToAdd(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    if (!email.trim()) { setError('Email is required.'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave(
        subscriber.email,
        firstName.trim(),
        email.trim().toLowerCase(),
        toAdd,
        Array.from(toRemove)
      );
      onClose();
    } catch (e: any) {
      setError(e.message ?? 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const totalSubs = existingActive.length + toAdd.length;

  return (
    <div className="subs-modal-overlay" onClick={onClose}>
      <div className="subs-modal subs-modal-lg" onClick={e => e.stopPropagation()}>
        <div className="subs-modal-header">
          <h2>Edit Subscriber</h2>
          <button className="subs-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="subs-modal-body">

          {/* Name + Email */}
          <div className="subs-modal-row">
            <div className="subs-modal-field">
              <label>First Name</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" className="subs-modal-input" />
            </div>
            <div className="subs-modal-field">
              <label>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="subs-modal-input" />
            </div>
          </div>

          {/* Subscriptions */}
          <div className="subs-modal-field">
            <label>Subscriptions ({totalSubs}) — click a calendar to remove it</label>

            <div className="subs-modal-cal-list">
              {/* Existing active subs */}
              {existingActive.map(r => (
                <button
                  key={r.id}
                  className="subs-modal-cal-item subs-modal-cal-active"
                  style={{ borderColor: calColor(r) + '66', color: calColor(r), background: calColor(r) + '12' }}
                  onClick={() => toggleRemove(r.id)}
                  title="Click to remove"
                >
                  {calLabel(r)}
                  <X size={12} className="subs-modal-cal-x" />
                </button>
              ))}

              {/* Subs marked for removal — shown crossed out */}
              {subscriber.subscriptions.filter(r => toRemove.has(r.id)).map(r => (
                <button
                  key={r.id}
                  className="subs-modal-cal-item subs-modal-cal-removing"
                  onClick={() => toggleRemove(r.id)}
                  title="Click to undo removal"
                >
                  <span className="subs-modal-strikethrough">{calLabel(r)}</span>
                  <span className="subs-modal-undo">undo</span>
                </button>
              ))}

              {/* Newly added subs */}
              {toAdd.map((a, i) => (
                <button
                  key={i}
                  className="subs-modal-cal-item subs-modal-cal-new"
                  style={{ borderColor: (CITY_COLORS[a.city] ?? '#6b7280') + '66', color: CITY_COLORS[a.city] ?? '#6b7280', background: (CITY_COLORS[a.city] ?? '#6b7280') + '12' }}
                  onClick={() => removeFromToAdd(i)}
                  title="Click to remove"
                >
                  + {a.sub_calendar ? `${a.city} — ${a.sub_calendar}` : `${a.city} (city-wide)`}
                  <X size={12} className="subs-modal-cal-x" />
                </button>
              ))}

              {/* Add button */}
              {availableToAdd.length > 0 && (
                <div className="subs-modal-add-wrap">
                  <button className="subs-modal-add-btn" onClick={() => setShowAddPicker(p => !p)}>
                    + Add Calendar
                  </button>
                  {showAddPicker && (
                    <div className="subs-modal-picker">
                      {ALL_CITIES.map(city => {
                        const cityOpts = availableToAdd.filter(c => c.city === city);
                        if (cityOpts.length === 0) return null;
                        return (
                          <div key={city} className="subs-modal-picker-group">
                            <div className="subs-modal-picker-city" style={{ color: CITY_COLORS[city] }}>{city}</div>
                            {cityOpts.map((c, i) => (
                              <button key={i} className="subs-modal-picker-opt" onClick={() => addCalendar(c)}>
                                {c.sub_calendar ?? 'City-wide (all events)'}
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {toRemove.size > 0 && (
              <p className="subs-modal-warning">⚠ {toRemove.size} subscription{toRemove.size > 1 ? 's' : ''} will be removed.</p>
            )}
            {toAdd.length > 0 && (
              <p className="subs-modal-info">✓ {toAdd.length} new subscription{toAdd.length > 1 ? 's' : ''} will be added.</p>
            )}
          </div>

          {error && <p className="subs-modal-error">{error}</p>}
        </div>
        <div className="subs-modal-footer">
          <button className="subs-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="subs-modal-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteModal({ subscriber, onClose, onConfirm }: {
  subscriber: Subscriber;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await onConfirm();
    onClose();
  }

  return (
    <div className="subs-modal-overlay" onClick={onClose}>
      <div className="subs-modal subs-modal-sm" onClick={e => e.stopPropagation()}>
        <div className="subs-modal-header">
          <h2>Delete Subscriber</h2>
          <button className="subs-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="subs-modal-body">
          <p className="subs-modal-confirm-text">
            This will permanently delete <strong>{subscriber.first_name ?? subscriber.email}</strong> and all <strong>{subscriber.subscriptions.length}</strong> of their subscription{subscriber.subscriptions.length !== 1 ? 's' : ''}. This cannot be undone.
          </p>
          <p className="subs-modal-confirm-email">{subscriber.email}</p>
        </div>
        <div className="subs-modal-footer">
          <button className="subs-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="subs-modal-delete" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function SubscribersPage() {
  const { isAuthenticated, logout, getAdminPassword } = useAdmin();

  const [rows, setRows]               = useState<SubRow[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [cityFilter, setCityFilter]   = useState('All');
  const [calFilter, setCalFilter]     = useState('All');
  const [expanded, setExpanded]       = useState<Set<string>>(new Set());
  const [sortKey, setSortKey]         = useState<SortKey>('since');
  const [sortDir, setSortDir]         = useState<SortDir>('desc');
  const [editTarget, setEditTarget]   = useState<Subscriber | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subscriber | null>(null);
  const [activeTab, setActiveTab]     = useState<'subscribers' | 'import' | 'premium'>('subscribers');

  // Premium tab state
  const [premiumRows, setPremiumRows]     = useState<PremiumRow[]>([]);
  const [premiumLoading, setPremiumLoading] = useState(true);
  const [premiumSearch, setPremiumSearch] = useState('');

  async function fetchSubs() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/subscribers?type=subscribers', {
        headers: { Authorization: `Bearer ${getAdminPassword()}` },
      });
      const json = await res.json();
      setRows((json.data ?? []) as SubRow[]);
    } catch {
      setRows([]);
    }
    setLoading(false);
  }

  async function fetchPremium() {
    setPremiumLoading(true);
    try {
      const res = await fetch('/api/admin/subscribers?type=premium', {
        headers: { Authorization: `Bearer ${getAdminPassword()}` },
      });
      const json = await res.json();
      setPremiumRows((json.data ?? []) as PremiumRow[]);
    } catch {
      setPremiumRows([]);
    }
    setPremiumLoading(false);
  }

  useEffect(() => { fetchSubs(); fetchPremium(); }, []);

  if (!isAuthenticated) return <AdminLogin />;

  // Group rows by email
  const subscribers: Subscriber[] = (() => {
    const map = new Map<string, Subscriber>();
    for (const row of rows) {
      const key = row.email.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { email: row.email, first_name: row.first_name, subscriptions: [], since: row.created_at });
      }
      const sub = map.get(key)!;
      sub.subscriptions.push(row);
      if (row.created_at < sub.since) sub.since = row.created_at;
      if (!sub.first_name && row.first_name) sub.first_name = row.first_name;
    }
    return Array.from(map.values());
  })();

  // Stats
  const cities = ['All', 'Austin', 'Dallas', 'Houston', 'San Antonio'];
  const subCalOptions = ['All', 'City-wide', 'Networking', 'Technology', 'Real Estate', 'Chamber', 'Small Business'];
  const cityStats = cities.slice(1).map(c => ({
    city: c,
    people: new Set(rows.filter(r => r.city === c).map(r => r.email.toLowerCase())).size,
    subs: rows.filter(r => r.city === c).length,
  }));

  // Sort
  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return <ArrowUpDown size={11} style={{ opacity: 0.4 }} />;
    return sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />;
  }

  function toggleExpand(email: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  }

  // Edit: update name/email, remove subs, add new subs
  async function handleSave(
    oldEmail: string,
    newFirstName: string,
    newEmail: string,
    toAdd: { city: string; sub_calendar: string | null }[],
    toRemoveIds: string[]
  ) {
    const existingIds = rows
      .filter(r => r.email.toLowerCase() === oldEmail.toLowerCase())
      .map(r => r.id);

    const res = await fetch('/api/admin/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminPassword()}`,
      },
      body: JSON.stringify({ oldEmail, newFirstName, newEmail, toAdd, toRemoveIds, existingIds }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'Failed to save');
    await fetchSubs();
  }

  // Delete: remove all rows for this subscriber
  async function handleDelete(email: string) {
    const ids = rows.filter(r => r.email.toLowerCase() === email.toLowerCase()).map(r => r.id);
    const res = await fetch('/api/admin/subscribers', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminPassword()}`,
      },
      body: JSON.stringify({ ids }),
    });
    if (res.ok) {
      setRows(prev => prev.filter(r => r.email.toLowerCase() !== email.toLowerCase()));
    }
  }

  // Filter + sort
  const filtered = subscribers
    .filter(s => {
      const matchSearch = !search ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.first_name ?? '').toLowerCase().includes(search.toLowerCase());
      const matchCity = cityFilter === 'All' ||
        s.subscriptions.some(r => r.city === cityFilter);
      const matchCal = calFilter === 'All' ||
        s.subscriptions.some(r =>
          calFilter === 'City-wide' ? !r.sub_calendar : r.sub_calendar === calFilter
        );
      return matchSearch && matchCity && matchCal;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name')  cmp = (a.first_name ?? '').localeCompare(b.first_name ?? '');
      if (sortKey === 'email') cmp = a.email.localeCompare(b.email);
      if (sortKey === 'count') cmp = a.subscriptions.length - b.subscriptions.length;
      if (sortKey === 'since') cmp = a.since.localeCompare(b.since);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  return (
    <div className="subs-page">

      {/* Modals */}
      {editTarget && (
        <EditModal
          subscriber={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          subscriber={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget.email)}
        />
      )}

      {/* Header */}
      <div className="subs-page-header">
        <div className="subs-page-header-inner">
          <div className="subs-page-title-row">
            <Link href="/admin" className="subs-back-btn">
              <ArrowLeft size={16} /> Back to Admin
            </Link>
            <h1><Users size={22} /> Subscribers</h1>
          </div>
          <button onClick={logout} className="btn-logout">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="subs-tabs">
        <button
          className={`subs-tab${activeTab === 'subscribers' ? ' active' : ''}`}
          onClick={() => setActiveTab('subscribers')}
        >
          <Users size={15} /> Subscribers
        </button>
        <button
          className={`subs-tab${activeTab === 'import' ? ' active' : ''}`}
          onClick={() => setActiveTab('import')}
        >
          <Upload size={15} /> Import CSV
        </button>
        <button
          className={`subs-tab${activeTab === 'premium' ? ' active' : ''}`}
          onClick={() => setActiveTab('premium')}
        >
          <Crown size={15} /> Premium
        </button>
      </div>

      <div className="subs-page-body">

        {/* Import Tab */}
        {activeTab === 'import' && (
          <SubscriberImport onImportComplete={() => { fetchSubs(); setActiveTab('subscribers'); }} />
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && <>

        {/* Stats */}
        <div className="subs-stats-row">
          <div className="subs-stat-card subs-stat-total">
            <span className="subs-stat-val">{subscribers.length.toLocaleString()}</span>
            <span className="subs-stat-lbl">Total People</span>
          </div>
          <div className="subs-stat-card subs-stat-total">
            <span className="subs-stat-val">{rows.length.toLocaleString()}</span>
            <span className="subs-stat-lbl">Total Subscriptions</span>
          </div>
          {cityStats.map(cs => (
            <div key={cs.city} className="subs-stat-card" style={{ borderTop: `3px solid ${CITY_COLORS[cs.city]}` }}>
              <span className="subs-stat-val">{cs.people.toLocaleString()}</span>
              <span className="subs-stat-lbl">{cs.city}</span>
              <span className="subs-stat-sublbl">{cs.subs} subscriptions</span>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="subs-controls">
          <div className="subs-search-wrap">
            <Search size={14} className="subs-search-icon" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="subs-search"
            />
            {search && (
              <button onClick={() => setSearch('')} className="subs-search-clear"><X size={13} /></button>
            )}
          </div>
          <div className="subs-filter-group">
            <span className="subs-filter-lbl">City:</span>
            <div className="subs-filter-tabs">
              {cities.map(c => (
                <button key={c} className={`subs-filter-tab${cityFilter === c ? ' active' : ''}`} onClick={() => setCityFilter(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div className="subs-filter-group">
            <span className="subs-filter-lbl">Calendar:</span>
            <div className="subs-filter-tabs">
              {subCalOptions.map(c => (
                <button key={c} className={`subs-filter-tab${calFilter === c ? ' active' : ''}`} onClick={() => setCalFilter(c)}>{c}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="subs-results-count">
          Showing <strong>{filtered.length.toLocaleString()}</strong> of <strong>{subscribers.length.toLocaleString()}</strong> subscribers
          {(search || cityFilter !== 'All' || calFilter !== 'All') && (
            <button className="subs-clear-filters" onClick={() => { setSearch(''); setCityFilter('All'); setCalFilter('All'); }}>
              Clear filters
            </button>
          )}
        </p>

        {/* Table */}
        {loading ? (
          <div className="subs-loading">Loading subscribers…</div>
        ) : filtered.length === 0 ? (
          <div className="subs-empty">No subscribers match your search.</div>
        ) : (
          <div className="subs-table-wrap">
            <table className="subs-table">
              <thead>
                <tr>
                  <th className={sortKey === 'name' ? 'sorted' : ''} onClick={() => handleSort('name')}>Name {sortIcon('name')}</th>
                  <th className={sortKey === 'email' ? 'sorted' : ''} onClick={() => handleSort('email')}>Email {sortIcon('email')}</th>
                  <th className={sortKey === 'count' ? 'sorted' : ''} onClick={() => handleSort('count')}>Subscribed To {sortIcon('count')}</th>
                  <th className={sortKey === 'since' ? 'sorted' : ''} onClick={() => handleSort('since')}>Since {sortIcon('since')}</th>
                  <th>Source</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const isOpen = expanded.has(s.email);
                  const visibleSubs = isOpen ? s.subscriptions : s.subscriptions.slice(0, 3);
                  const extra = s.subscriptions.length - 3;
                  return (
                    <tr key={s.email} className={isOpen ? 'row-open' : ''}>
                      <td className="subs-td-name">{s.first_name ?? <span className="subs-none">—</span>}</td>
                      <td className="subs-td-email">{s.email}</td>
                      <td className="subs-td-tags">
                        {visibleSubs.map(r => (
                          <span key={r.id} className="subs-tag" style={{ background: calColor(r) + '18', color: calColor(r), borderColor: calColor(r) + '44' }}>
                            {calLabel(r)}
                          </span>
                        ))}
                        {!isOpen && extra > 0 && (
                          <button className="subs-more-btn" onClick={() => toggleExpand(s.email)}>+{extra} more</button>
                        )}
                        {isOpen && s.subscriptions.length > 3 && (
                          <button className="subs-more-btn" onClick={() => toggleExpand(s.email)}>Show less</button>
                        )}
                      </td>
                      <td className="subs-td-date">{formatDate(s.since)}</td>
                      <td>
                        <span className={`subs-source-badge ${s.subscriptions[0]?.source === 'migrated' ? 'migrated' : 'new'}`}>
                          {s.subscriptions[0]?.source === 'migrated' ? 'migrated' : 'new signup'}
                        </span>
                      </td>
                      <td className="subs-td-actions">
                        <button className="subs-action-btn subs-edit-btn" onClick={() => setEditTarget(s)} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button className="subs-action-btn subs-delete-btn" onClick={() => setDeleteTarget(s)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        </> /* end subscribers tab */}

        {/* ── Premium Tab ────────────────────────────────────────────── */}
        {activeTab === 'premium' && (() => {
          const now = new Date();

          function premiumStatusLabel(row: PremiumRow): { label: string; cls: string } {
            if (row.grace_period_ends_at && new Date(row.grace_period_ends_at) > now) {
              return { label: 'Grace Period', cls: 'prem-badge-grace' };
            }
            const s = (row.subscription_status ?? '').toLowerCase();
            if (s === 'active') return { label: 'Active', cls: 'prem-badge-active' };
            if (s === 'cancelled' || s === 'canceled') return { label: 'Cancelled', cls: 'prem-badge-cancelled' };
            if (s === 'past_due') return { label: 'Past Due', cls: 'prem-badge-pastdue' };
            return { label: row.subscription_status ?? 'Unknown', cls: 'prem-badge-unknown' };
          }

          const activeCount     = premiumRows.filter(r => (r.subscription_status ?? '').toLowerCase() === 'active' && !(r.grace_period_ends_at && new Date(r.grace_period_ends_at) > now)).length;
          const graceCount      = premiumRows.filter(r => r.grace_period_ends_at && new Date(r.grace_period_ends_at) > now).length;
          const cancelledCount  = premiumRows.filter(r => {
            const s = (r.subscription_status ?? '').toLowerCase();
            return (s === 'cancelled' || s === 'canceled') && !(r.grace_period_ends_at && new Date(r.grace_period_ends_at) > now);
          }).length;

          const premiumCityStats = ['San Antonio', 'Austin', 'Dallas', 'Houston'].map(city => ({
            city,
            count: premiumRows.filter(r => r.city === city).length,
          }));

          const filteredPremium = premiumRows.filter(r =>
            !premiumSearch ||
            r.email.toLowerCase().includes(premiumSearch.toLowerCase()) ||
            (r.first_name ?? '').toLowerCase().includes(premiumSearch.toLowerCase())
          );

          return (
            <>
              {/* Stats */}
              <div className="subs-stats-row">
                <div className="subs-stat-card subs-stat-total">
                  <span className="subs-stat-val">{premiumRows.length}</span>
                  <span className="subs-stat-lbl">Total Premium Users</span>
                </div>
                <div className="subs-stat-card" style={{ borderTop: '3px solid #16a34a' }}>
                  <span className="subs-stat-val">{activeCount}</span>
                  <span className="subs-stat-lbl">Active</span>
                </div>
                <div className="subs-stat-card" style={{ borderTop: '3px solid #f59e0b' }}>
                  <span className="subs-stat-val">{graceCount}</span>
                  <span className="subs-stat-lbl">Grace Period</span>
                </div>
                <div className="subs-stat-card" style={{ borderTop: '3px solid #6b7280' }}>
                  <span className="subs-stat-val">{cancelledCount}</span>
                  <span className="subs-stat-lbl">Cancelled</span>
                </div>
                {premiumCityStats.map(cs => (
                  <div key={cs.city} className="subs-stat-card" style={{ borderTop: `3px solid ${CITY_COLORS[cs.city] ?? '#6b7280'}` }}>
                    <span className="subs-stat-val">{cs.count}</span>
                    <span className="subs-stat-lbl">{cs.city}</span>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div className="subs-controls">
                <div className="subs-search-wrap">
                  <Search size={14} className="subs-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by name or email…"
                    value={premiumSearch}
                    onChange={e => setPremiumSearch(e.target.value)}
                    className="subs-search"
                  />
                  {premiumSearch && (
                    <button onClick={() => setPremiumSearch('')} className="subs-search-clear"><X size={13} /></button>
                  )}
                </div>
              </div>

              <p className="subs-results-count">
                Showing <strong>{filteredPremium.length}</strong> of <strong>{premiumRows.length}</strong> premium users
              </p>

              {/* Table */}
              {premiumLoading ? (
                <div className="subs-loading">Loading premium users…</div>
              ) : filteredPremium.length === 0 ? (
                <div className="subs-empty">No premium users found.</div>
              ) : (
                <div className="subs-table-wrap">
                  <table className="subs-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>City</th>
                        <th>Status</th>
                        <th>Tier</th>
                        <th>Stripe Customer</th>
                        <th>Grace Period Ends</th>
                        <th>Since</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPremium.map(r => {
                        const { label, cls } = premiumStatusLabel(r);
                        return (
                          <tr key={r.id}>
                            <td className="subs-td-name">{r.first_name ?? <span className="subs-none">—</span>}</td>
                            <td className="subs-td-email">{r.email}</td>
                            <td>
                              {r.city
                                ? <span className="subs-tag" style={{ background: (CITY_COLORS[r.city] ?? '#6b7280') + '18', color: CITY_COLORS[r.city] ?? '#6b7280', borderColor: (CITY_COLORS[r.city] ?? '#6b7280') + '44' }}>{r.city}</span>
                                : <span className="subs-none">—</span>}
                            </td>
                            <td><span className={`prem-badge ${cls}`}>{label}</span></td>
                            <td><span className="prem-tier">{r.subscription_tier ?? '—'}</span></td>
                            <td className="subs-td-email" style={{ fontSize: '11px', color: '#6b7280' }}>
                              {r.stripe_customer_id
                                ? <a href={`https://dashboard.stripe.com/customers/${r.stripe_customer_id}`} target="_blank" rel="noreferrer" style={{ color: '#635bff', textDecoration: 'none' }}>{r.stripe_customer_id}</a>
                                : <span className="subs-none">—</span>}
                            </td>
                            <td className="subs-td-date" style={{ fontSize: '11px', color: '#f59e0b' }}>
                              {r.grace_period_ends_at ? formatDate(r.grace_period_ends_at) : <span className="subs-none">—</span>}
                            </td>
                            <td className="subs-td-date">{formatDate(r.created_at)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          );
        })()}

      </div>
    </div>
  );
}
