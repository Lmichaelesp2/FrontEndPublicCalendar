'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, RefreshCw, Search, X, ChevronDown, ChevronUp, ArrowUpDown, LogOut, ArrowLeft } from 'lucide-react';
import { supabaseAdmin } from '../../lib/supabase';
import { useAdmin } from '../../contexts/AdminContext';
import { AdminLogin } from './AdminLogin';

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

// ── Component ─────────────────────────────────────────────────────────────────

export function SubscribersPage() {
  const { isAuthenticated, logout } = useAdmin();

  const [rows, setRows]             = useState<SubRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [calFilter, setCalFilter]   = useState('All');
  const [expanded, setExpanded]     = useState<Set<string>>(new Set());
  const [sortKey, setSortKey]       = useState<SortKey>('since');
  const [sortDir, setSortDir]       = useState<SortDir>('desc');

  if (!isAuthenticated) return <AdminLogin />;

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

      <div className="subs-page-body">

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
            <div
              key={cs.city}
              className="subs-stat-card"
              style={{ borderTop: `3px solid ${CITY_COLORS[cs.city]}` }}
            >
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
              <button onClick={() => setSearch('')} className="subs-search-clear">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="subs-filter-group">
            <span className="subs-filter-lbl">City:</span>
            <div className="subs-filter-tabs">
              {cities.map(c => (
                <button
                  key={c}
                  className={`subs-filter-tab${cityFilter === c ? ' active' : ''}`}
                  onClick={() => setCityFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="subs-filter-group">
            <span className="subs-filter-lbl">Calendar:</span>
            <div className="subs-filter-tabs">
              {subCalOptions.map(c => (
                <button
                  key={c}
                  className={`subs-filter-tab${calFilter === c ? ' active' : ''}`}
                  onClick={() => setCalFilter(c)}
                >
                  {c}
                </button>
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
                  const visibleSubs = isOpen ? s.subscriptions : s.subscriptions.slice(0, 3);
                  const extra = s.subscriptions.length - 3;
                  return (
                    <tr key={s.email} className={isOpen ? 'row-open' : ''}>
                      <td className="subs-td-name">{s.first_name ?? <span className="subs-none">—</span>}</td>
                      <td className="subs-td-email">{s.email}</td>
                      <td className="subs-td-tags">
                        {visibleSubs.map(r => (
                          <span
                            key={r.id}
                            className="subs-tag"
                            style={{ background: calColor(r) + '18', color: calColor(r), borderColor: calColor(r) + '44' }}
                          >
                            {calLabel(r)}
                          </span>
                        ))}
                        {!isOpen && extra > 0 && (
                          <button className="subs-more-btn" onClick={() => toggleExpand(s.email)}>
                            +{extra} more
                          </button>
                        )}
                        {isOpen && s.subscriptions.length > 3 && (
                          <button className="subs-more-btn" onClick={() => toggleExpand(s.email)}>
                            Show less
                          </button>
                        )}
                      </td>
                      <td className="subs-td-date">{formatDate(s.since)}</td>
                      <td>
                        <span className={`subs-source-badge ${s.subscriptions[0]?.source === 'migrated' ? 'migrated' : 'new'}`}>
                          {s.subscriptions[0]?.source === 'migrated' ? 'migrated' : 'new signup'}
                        </span>
                      </td>
                      <td>
                        <button className="subs-expand-btn" onClick={() => toggleExpand(s.email)}>
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
    </div>
  );
}
