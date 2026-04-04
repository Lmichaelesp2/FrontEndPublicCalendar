'use client';
import { useState, useEffect } from 'react';
import { Check, X, RefreshCw, MapPin, Globe, Clock, Calendar } from 'lucide-react';
import { supabase, supabaseAdmin, Event } from '../../lib/supabase';

export function PendingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching pending events:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    setActionLoading(id);
    try {
      const { error } = await supabaseAdmin
        .from('events')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error approving event:', error);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id: string) {
    setActionLoading(id);
    try {
      const { error } = await supabaseAdmin
        .from('events')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error rejecting event:', error);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="pending-section">
      <div className="pending-header">
        <div>
          <h3>Pending Submissions</h3>
          <p className="pending-count">
            {events.length} event{events.length !== 1 ? 's' : ''} awaiting review
          </p>
        </div>
        <button onClick={fetchPending} className="btn-secondary" disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="pending-empty">Loading pending events...</div>
      ) : events.length === 0 ? (
        <div className="pending-empty">No pending events to review.</div>
      ) : (
        <div className="pending-list">
          {events.map(event => (
            <div key={event.id} className="pending-card">
              <div className="pending-card-top">
                <div className="pending-card-info">
                  <h4>{event.name}</h4>
                  {event.org_name && (
                    <span className="pending-org">by {event.org_name}</span>
                  )}
                </div>
                <div className="pending-card-actions">
                  <button
                    onClick={() => handleApprove(event.id)}
                    disabled={actionLoading === event.id}
                    className="approve-btn"
                    title="Approve"
                  >
                    <Check size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(event.id)}
                    disabled={actionLoading === event.id}
                    className="reject-btn"
                    title="Reject"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              </div>
              <div className="pending-card-details">
                <span className="pending-detail">
                  <Calendar size={13} />
                  {event.start_date}
                </span>
                {event.start_time && (
                  <span className="pending-detail">
                    <Clock size={13} />
                    {event.start_time}
                  </span>
                )}
                {event.address && (
                  <span className="pending-detail">
                    <MapPin size={13} />
                    {event.address}
                  </span>
                )}
                {event.website && (
                  <span className="pending-detail">
                    <Globe size={13} />
                    <a href={event.website} target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  </span>
                )}
                <span className="pending-badge">{event.paid}</span>
                <span className="pending-badge">{event.participation}</span>
                {event.city_calendar && <span className="pending-badge">{event.city_calendar}</span>}
              </div>
              {event.description && (
                <p className="pending-desc">{event.description}</p>
              )}
              <p className="pending-submitted">
                Submitted {new Date(event.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
