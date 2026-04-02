'use client';
import { useState } from 'react';
import { LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import { useAdmin } from '../../contexts/AdminContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { CSVUpload } from './CSVUpload';
import { EventPreview } from './EventPreview';
import { PendingEvents } from './PendingEvents';
import { ClearPastEvents } from './ClearPastEvents';
import { EventInput } from '../../lib/csvParser';

export function AdminPanel() {
  const { isAuthenticated, logout } = useAdmin();
  const [events, setEvents] = useState<EventInput[]>([]);

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Event Admin Panel</h1>
          <div className="flex gap-2">
            <Link href="/" className="btn-secondary flex items-center gap-2">
              <Home size={16} />
              Back to Home
            </Link>
            <button onClick={logout} className="btn-logout">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <AdminDashboard />
        <PendingEvents />
        <ClearPastEvents />
        <CSVUpload onEventsLoaded={setEvents} />
        <EventPreview
          events={events}
          onEventsChange={setEvents}
          onPublish={() => setEvents([])}
        />
      </div>
    </div>
  );
}
