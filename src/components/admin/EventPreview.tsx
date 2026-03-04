import { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { EventInput, validateEvent } from '../../lib/csvParser';
import { supabase, CITIES } from '../../lib/supabase';

type EventPreviewProps = {
  events: EventInput[];
  onEventsChange: (events: EventInput[]) => void;
  onPublish: () => void;
};

export function EventPreview({ events, onEventsChange, onPublish }: EventPreviewProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDelete = (index: number) => {
    onEventsChange(events.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number, updatedEvent: EventInput) => {
    const updated = [...events];
    updated[index] = updatedEvent;
    onEventsChange(updated);
    setEditingIndex(null);
  };

  const handlePublishAll = async () => {
    setPublishing(true);
    setPublishMessage(null);

    try {
      const validEvents = events.filter(event => validateEvent(event).length === 0);

      if (validEvents.length === 0) {
        setPublishMessage({ type: 'error', text: 'No valid events to publish' });
        setPublishing(false);
        return;
      }

      const { error } = await supabase.from('events').insert(validEvents);

      if (error) throw error;

      const citySet = new Set(
        validEvents
          .map((e) => e.city_calendar)
          .filter(Boolean) as string[]
      );

      await supabase.from('upload_history').insert({
        event_count: validEvents.length,
        cities: Array.from(citySet),
        source: 'csv',
        notes: `${validEvents.length} events across ${citySet.size} ${citySet.size === 1 ? 'city' : 'cities'}`,
      });

      setPublishMessage({
        type: 'success',
        text: `Successfully published ${validEvents.length} events!`
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error publishing events:', error);
      setPublishMessage({
        type: 'error',
        text: 'Failed to publish events. Please try again.'
      });
    } finally {
      setPublishing(false);
    }
  };

  const validCount = events.filter(e => validateEvent(e).length === 0).length;
  const invalidCount = events.length - validCount;

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="event-preview">
      <div className="preview-header">
        <div>
          <h3>Preview Events ({events.length} total)</h3>
          <p className="preview-stats">
            <span className="valid">{validCount} valid</span>
            {invalidCount > 0 && <span className="invalid">{invalidCount} invalid</span>}
          </p>
        </div>
        <div className="preview-actions">
          <button
            onClick={() => onEventsChange([])}
            className="btn-secondary"
          >
            Clear All
          </button>
          <button
            onClick={handlePublishAll}
            disabled={publishing || validCount === 0}
            className="btn btn-gold"
          >
            {publishing ? 'Publishing...' : `Publish ${validCount} Events`}
          </button>
        </div>
      </div>

      {publishMessage && (
        <div className={`form-message ${publishMessage.type}`}>
          {publishMessage.text}
        </div>
      )}

      <div className="events-list">
        {events.map((event, index) => {
          const errors = validateEvent(event);
          const isEditing = editingIndex === index;

          return (
            <div key={index} className={`event-item ${errors.length > 0 ? 'invalid' : ''}`}>
              {isEditing ? (
                <EventEditForm
                  event={event}
                  onSave={(updated) => handleEdit(index, updated)}
                  onCancel={() => setEditingIndex(null)}
                />
              ) : (
                <>
                  <div className="event-content">
                    <div className="event-header">
                      <h4>{event.name}</h4>
                      <div className="event-actions">
                        <button
                          onClick={() => setEditingIndex(index)}
                          className="icon-btn"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="icon-btn delete"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="event-details">
                      <p><strong>Date:</strong> {event.start_date} {event.start_time || ''}</p>
                      {event.address && <p><strong>Location:</strong> {event.address}</p>}
                      {event.website && <p><strong>Website:</strong> {event.website}</p>}
                      <p><strong>Format:</strong> {event.participation} | <strong>Cost:</strong> {event.paid}{event.city_calendar && <> | <strong>City:</strong> {event.city_calendar}</>}</p>
                    </div>
                    {errors.length > 0 && (
                      <div className="event-errors">
                        {errors.map((error, i) => (
                          <p key={i}>{error}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type EventEditFormProps = {
  event: EventInput;
  onSave: (event: EventInput) => void;
  onCancel: () => void;
};

function EventEditForm({ event, onSave, onCancel }: EventEditFormProps) {
  const [formData, setFormData] = useState(event);

  const handleChange = (field: keyof EventInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value || null }));
  };

  return (
    <div className="event-edit-form">
      <div className="form-row">
        <div className="form-group">
          <label>Event Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Start Date *</label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => handleChange('start_date', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Start Time</label>
          <input
            type="text"
            value={formData.start_time || ''}
            onChange={(e) => handleChange('start_time', e.target.value)}
            placeholder="9:00 AM"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Website</label>
          <input
            type="url"
            value={formData.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <select
            value={formData.city_calendar || 'San Antonio'}
            onChange={(e) => handleChange('city_calendar', e.target.value)}
          >
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button onClick={onCancel} className="btn-secondary">
          <X size={16} /> Cancel
        </button>
        <button onClick={() => onSave(formData)} className="btn btn-gold">
          <Check size={16} /> Save
        </button>
      </div>
    </div>
  );
}
