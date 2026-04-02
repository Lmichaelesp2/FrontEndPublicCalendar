'use client';
import { useEffect, useState } from 'react';
import { Calendar, Upload, MapPin, Clock, RefreshCw } from 'lucide-react';
import { supabase, CITIES } from '../../lib/supabase';

type CityCount = { city: string; count: number };
type UploadRecord = {
  id: string;
  event_count: number;
  cities: string[];
  source: string;
  notes: string;
  uploaded_at: string;
};

export function AdminDashboard() {
  const [totalEvents, setTotalEvents] = useState(0);
  const [cityCounts, setCityCounts] = useState<CityCount[]>([]);
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);

    const [eventsRes, uploadsRes] = await Promise.all([
      supabase.from('events').select('city_calendar', { count: 'exact' }),
      supabase
        .from('upload_history')
        .select('*')
        .order('uploaded_at', { ascending: false })
        .limit(20),
    ]);

    if (eventsRes.data) {
      setTotalEvents(eventsRes.data.length);
      const counts: Record<string, number> = {};
      CITIES.forEach((c) => (counts[c] = 0));
      eventsRes.data.forEach((e: { city_calendar: string | null }) => {
        const city = e.city_calendar || 'Unknown';
        counts[city] = (counts[city] || 0) + 1;
      });
      setCityCounts(
        Object.entries(counts)
          .map(([city, count]) => ({ city, count }))
          .sort((a, b) => b.count - a.count)
      );
    }

    if (uploadsRes.data) {
      setUploads(uploadsRes.data as UploadRecord[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(iso);
  };

  return (
    <div className="admin-dashboard">
      <div className="dash-title-row">
        <h3>Dashboard</h3>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="dash-refresh"
          title="Refresh stats"
        >
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
        </button>
      </div>

      <div className="dash-stats">
        <div className="dash-stat-card dash-stat-total">
          <Calendar size={20} />
          <div>
            <span className="dash-stat-value">{totalEvents}</span>
            <span className="dash-stat-label">Total Events</span>
          </div>
        </div>
        {cityCounts.map((cc) => (
          <div key={cc.city} className="dash-stat-card">
            <MapPin size={16} />
            <div>
              <span className="dash-stat-value">{cc.count}</span>
              <span className="dash-stat-label">{cc.city}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-history">
        <h4>
          <Upload size={15} />
          Upload History
        </h4>

        {uploads.length === 0 && !loading && (
          <p className="dash-empty">No uploads recorded yet.</p>
        )}

        {uploads.length > 0 && (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Events</th>
                  <th>Cities</th>
                  <th>Source</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((u) => (
                  <tr key={u.id}>
                    <td className="dash-when">
                      <Clock size={13} />
                      <span title={`${formatDate(u.uploaded_at)} at ${formatTime(u.uploaded_at)}`}>
                        {timeAgo(u.uploaded_at)}
                      </span>
                    </td>
                    <td>
                      <span className="dash-badge">{u.event_count}</span>
                    </td>
                    <td className="dash-cities">
                      {u.cities.length > 0
                        ? u.cities.join(', ')
                        : '--'}
                    </td>
                    <td className="dash-source">{u.source}</td>
                    <td className="dash-notes">{u.notes || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
