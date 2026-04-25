'use client';
import { useEffect, useState } from 'react';
import { Users, RefreshCw, Search, X, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { supabase, supabaseAdmin } from '../../lib/supabase';

type SortKey = 'name' | 'email' | 'count' | 'since';
type SortDir = 'asc' | 'desc';

// ── Types ────────────────────────────────────────────────────────────────────

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
  since: string; // earliest created_at
};

// ── Helpers ──────────────────────────────────────────────────────────────────

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

// ── Component ────────────────────────────────────────────────────────────────

export function SubscriberManager() {
  const [rows, setRows]             = useState<SubRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [expanded, setExpanded]     = useState<Set<string>>(new Set());
  const [sortKey, setSortKey]       = useState<SortKey>('since');
  const [sortDir, setSortDir]       = useState<SortDir>('desc');

  async function fetchSubs() {
    setLoading(true);
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscriptions')
      .select('id, email, first_name, city, sub_calendar, status, source, created_at')
      .order('created_at', { ascending: false })
      .limit(10000);

    if (!error && data) setRows(data as SubRow[]);
    setLoading(false);
  }

  useEffect(() => { fetchSubs(); }, []);

  // Group rows by email into Subscriber objects
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
  const totalPeople = subscribers.length;
  const totalSubs   = rows.length;
  const cities      = ['All', 'Austin', 'Dallas', 'Houston', 'San Antonio'];
  const cityStats   = cities.slice(1).map(c => ({
    city: c,
    people: new Set(rows.filter(r => r.city === c).map(r => r.email.toLowerCase())).size,
    subs:   rows.filter(r => r.city === c).length,
  }));

  // Sort helper
  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return <ArrowUpDown size={11} style={{ opacity: 0.4 }} />;
    return sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />;
  }

  // Filter + sort
  const filtered = subscribers
    .filter(s => {
      const matchSearch = !search ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.first_name ?? '').toLowerCase().includes(search.toLowerCase());
      const matchCity = cityFilter === 'All' ||
        s.subscriptions.some(r => r.city === cityFilter);
      return matchSearch && matchCity;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name')  cmp = (a.first_name ?? '').localeCompare(b.first_name ?? '');
      if (sortKey === 'email') cmp = a.email.localeCompare(b.email);
      if (sortKey === 'count') cmp = a.subscriptions.length - b.subscriptions.length;
      if (sortKey === 'since') cmp = a.since.localeCompare(b.since);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  function toggleExpand(email: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  }

  return (
    <div className="admin-section subscriber-manager">

      {/* Header */}
      <div className="dash-title-row">
        <h3><Users size={18} style={{ display: 'inline', marginRight: 8 }} />Subscribers</h3>
        <button onClick={fetchSubs} disabled={loading} className="dash-refresh" title="Refresh">
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
        </button>
      </div>

      {/* Stats row */}
      <div className="sub-mgr-stats">
        <div className="sub-mgr-stat">
          <span className="sub-mgr-stat-val">{totalPeople.toLocaleString()}</span>
          <span className="sub-mgr-stat-lbl">People</span>
        </div>
        <div className="sub-mgr-stat">
          <span className="sub-mgr-stat-val">{totalSubs.toLocaleString()}</span>
          <span className="sub-mgr-stat-lbl">Total Subscriptions</span>
        </div>
        {cityStats.map(cs => (
          <div key={cs.city} className="sub-mgr-stat" style={{ borderLeft: `3px solid ${CITY_COLORS[cs.city]}` }}>
            <span className="sub-mgr-stat-val">{cs.people.toLocaleString()}</span>
            <span className="sub-mgr-stat-lbl">{cs.city}</span>
            <span className="sub-mgr-stat-sublbl">{cs.subs} subscriptions</span>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="sub-mgr-controls">
        <div className="sub-mgr-search-wrap">
          <Search size={14} className="sub-mgr-search-icon" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="sub-mgr-search"
          />
          {search && (
            <button onClick={() => setSearch('')} className="sub-mgr-search-clear">
              <X size={13} />
            </button>
          )}
        </div>
        <div className="sub-mgr-city-tabs">
          {cities.map(c => (
            <button
              key={c}
              className={`sub-mgr-city-tab${cityFilter === c ? ' active' : ''}`}
              onClick={() => setCityFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="sub-mgr-count">
        Showing {filtered.length.toLocaleString()} of {totalPeople.toLocaleString()} subscribers
      </p>

      {/* Table */}
      {loading ? (
        <p className="dash-empty">Loading subscribers…</p>
      ) : filtered.length === 0 ? (
        <p className="dash-empty">No subscribers match your search.</p>
      ) : (
        <div className="sub-mgr-table-wrap">
          <table className="sub-mgr-table">
            <thead>
              <tr>
                <th className={sortKey === 'name' ? 'sorted' : ''} onClick={() => handleSort('name')}>
                  Name {sortIcon('name')}
                </th>
                <th className={sortKey === 'email' ? 'sorted' : ''} onClick={() => handleSort('email')}>
                  Email {sortIcon('email')}
                </th>
                <th className={sortKey === 'count' ? 'sorted' : ''} onClick={() => handleSort('count')}>
                  Subscribed To {sortIcon('count')}
                </th>
                <th className={sortKey === 'since' ? 'sorted' : ''} onClick={() => handleSort('since')}>
                  Since {sortIcon('since')}
                </th>
                <th>Source</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const isOpen = expanded.has(s.email);
                const visibleSubs = isOpen ? s.subscriptions : s.subscriptions.slice(0, 2);
                const extra = s.subscriptions.length - 2;
                return (
                  <tr key={s.email} className={isOpen ? 'sub-mgr-row-open' : ''}>
                    <td className="sub-mgr-name">{s.first_name ?? <span className="sub-mgr-none">—</span>}</td>
                    <td className="sub-mgr-email">{s.email}</td>
                    <td className="sub-mgr-tags">
                      {visibleSubs.map(r => (
                        <span
                          key={r.id}
                          className="sub-mgr-tag"
                          style={{ background: calColor(r) + '22', color: calColor(r), borderColor: calColor(r) + '55' }}
                        >
                          {calLabel(r)}
                        </span>
                      ))}
                      {!isOpen && extra > 0 && (
                        <button className="sub-mgr-more" onClick={() => toggleExpand(s.email)}>
                          +{extra} more
                        </button>
                      )}
                      {isOpen && s.subscriptions.length > 2 && (
                        <button className="sub-mgr-more" onClick={() => toggleExpand(s.email)}>
                          Show less
                        </button>
                      )}
                    </td>
                    <td className="sub-mgr-date">{formatDate(s.since)}</td>
                    <td>
                      <span className={`sub-mgr-source ${s.subscriptions[0]?.source === 'migrated' ? 'migrated' : 'new'}`}>
                        {s.subscriptions[0]?.source === 'migrated' ? 'migrated' : 'new signup'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="sub-mgr-expand-btn"
                        onClick={() => toggleExpand(s.email)}
                        title={isOpen ? 'Collapse' : 'Expand'}
                      >
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
