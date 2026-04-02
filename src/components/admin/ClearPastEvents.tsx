'use client';
import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

export function ClearPastEvents() {
  const { getAdminPassword } = useAdmin();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count: number } | null>(null);

  const handleClearAllEvents = async () => {
    setIsDeleting(true);
    setResult(null);

    try {
      const adminPassword = getAdminPassword();
      if (!adminPassword) {
        throw new Error('Not authenticated');
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-operations`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'delete_all',
          adminPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete events');
      }

      const data = await response.json();
      setResult({ success: true, count: data.count || 0 });
      setShowConfirm(false);
    } catch (error) {
      console.error('Error deleting all events:', error);
      setResult({ success: false, count: 0 });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card-title">Clear All Events</h2>
      <p className="text-sm text-gray-600 mb-4">
        Remove all events from the database. This will clear the entire calendar.
      </p>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="btn-danger"
          disabled={isDeleting}
        >
          <Trash2 size={16} />
          Clear All Events
        </button>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="text-amber-600 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">
                Confirm Deletion
              </h3>
              <p className="text-sm text-amber-800">
                This will permanently delete ALL events from the database. This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClearAllEvents}
              disabled={isDeleting}
              className="btn-danger"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete All Events'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {result && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            result.success
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {result.success
            ? `Successfully deleted ${result.count} event${result.count !== 1 ? 's' : ''}.`
            : 'Failed to delete events. Please try again.'}
        </div>
      )}
    </div>
  );
}
