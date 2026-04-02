'use client';
import { useState } from 'react';
import { supabase, CITIES } from '../lib/supabase';

export function EventSubmission() {
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    website: '',
    description: '',
    paid: 'Unknown',
    address: '',
    zipcode: '',
    group_name: '',
    participation: 'In-Person',
    part_of_town: '',
    city_calendar: 'San Antonio'
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('events').insert([
        {
          ...formData,
          status: 'pending'
        }
      ]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Event submitted! It will appear on the calendar once reviewed and approved.' });
      setFormData({
        name: '',
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        website: '',
        description: '',
        paid: 'Unknown',
        address: '',
        zipcode: '',
        group_name: '',
        participation: 'In-Person',
        part_of_town: '',
        city_calendar: 'San Antonio'
      });

      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Error submitting event:', error);
      setMessage({ type: 'error', text: 'Failed to submit event. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="submit-section" id="submit">
      <div className="submit-inner">
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Event Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter event name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date *</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                required
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="start_time">Start Time</label>
              <input
                type="text"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                placeholder="e.g., 9:00 AM"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="end_time">End Time</label>
              <input
                type="text"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                placeholder="e.g., 5:00 PM"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="website">Event Website/Registration</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your event"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="paid">Cost</label>
              <select id="paid" name="paid" value={formData.paid} onChange={handleChange}>
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
                <option value="Both">Both</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="participation">Format</label>
              <select
                id="participation"
                name="participation"
                value={formData.participation}
                onChange={handleChange}
              >
                <option value="In-Person">In-Person</option>
                <option value="Virtual">Virtual</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city_calendar">City *</label>
              <select
                id="city_calendar"
                name="city_calendar"
                value={formData.city_calendar}
                onChange={handleChange}
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, TX"
              />
            </div>
            <div className="form-group">
              <label htmlFor="zipcode">ZIP Code</label>
              <input
                type="text"
                id="zipcode"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                placeholder="78201"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="group_name">Organization Name</label>
              <input
                type="text"
                id="group_name"
                name="group_name"
                value={formData.group_name}
                onChange={handleChange}
                placeholder="Your organization or group"
              />
            </div>
            <div className="form-group">
              <label htmlFor="part_of_town">Part of Town</label>
              <input
                type="text"
                id="part_of_town"
                name="part_of_town"
                value={formData.part_of_town}
                onChange={handleChange}
                placeholder="e.g., North, Central"
              />
            </div>
          </div>

          {message && (
            <div className={`form-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn btn-gold" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Event'}
          </button>
        </form>
      </div>
    </section>
  );
}
