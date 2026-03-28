import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { supabase } from '../lib/supabase';
import { CheckCircle, AlertCircle, ChevronDown, Info } from 'lucide-react';

const CITIES = ['San Antonio', 'Austin', 'Dallas', 'Houston'];
const CATEGORIES = [
  'Networking',
  'Chamber',
  'Technology',
  'Real Estate',
  'Small Business',
  'General Business',
];
const FREQUENCIES = ['Weekly', 'Bi-weekly', 'Monthly'];

const GUIDELINES = [
  'Events must be business or professionally focused (networking, education, industry-specific)',
  'Events must be in San Antonio, Austin, Dallas, or Houston, Texas',
  'All events are free to submit — we do not charge to list events',
  'Social events, fundraisers, and consumer events are not eligible',
  'We reserve the right to decline events that do not fit the calendar\'s focus',
];

interface FormState {
  event_name: string;
  event_date: string;
  start_time: string;
  end_time: string;
  city: string;
  category: string;
  venue_name: string;
  venue_address: string;
  description: string;
  event_url: string;
  organizer_name: string;
  contact_email: string;
  is_recurring: boolean;
  recurring_frequency: string;
}

const EMPTY_FORM: FormState = {
  event_name: '',
  event_date: '',
  start_time: '',
  end_time: '',
  city: '',
  category: '',
  venue_name: '',
  venue_address: '',
  description: '',
  event_url: '',
  organizer_name: '',
  contact_email: '',
  is_recurring: false,
  recurring_frequency: '',
};

export function SubmitEventPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'description') setCharCount(value.length);
  }

  function handleRecurringToggle(value: boolean) {
    setForm(prev => ({ ...prev, is_recurring: value, recurring_frequency: value ? prev.recurring_frequency : '' }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: dbError } = await supabase.from('event_submissions').insert([{
        event_name: form.event_name,
        event_date: form.event_date,
        start_time: form.start_time,
        end_time: form.end_time || null,
        city: form.city,
        category: form.category,
        venue_name: form.venue_name,
        venue_address: form.venue_address,
        description: form.description,
        event_url: form.event_url,
        organizer_name: form.organizer_name,
        contact_email: form.contact_email,
        is_recurring: form.is_recurring,
        recurring_frequency: form.is_recurring ? form.recurring_frequency || null : null,
        status: 'pending',
      }]);

      if (dbError) throw dbError;
      setSubmitted(true);
      setForm(EMPTY_FORM);
      setCharCount(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="se-page">
      <SEOHead
        title="Submit a Business Event | Local Business Calendars — Add Your Event Free"
        description="Submit your networking event, chamber meeting, business mixer, workshop, or professional development session to the Local Business Calendars network. Free to list."
      />
      <Navigation />

      <div className="se-hero">
        <div className="se-hero-inner">
          <div className="se-hero-badge">Free to Submit</div>
          <h1>Submit Your Business or Networking Event</h1>
          <p>
            Add your networking event, chamber meeting, business mixer, workshop, or professional
            development session to the Local Business Calendars network. We review all submissions
            and add approved events to the appropriate city calendar. Submission is free.
          </p>
        </div>
      </div>

      <div className="se-body">
        <div className="se-body-inner">
          {submitted ? (
            <div className="se-success">
              <div className="se-success-icon">
                <CheckCircle size={52} strokeWidth={1.5} />
              </div>
              <h2>Submission Received!</h2>
              <p>
                Thank you! We've received your event submission and will review it within 2 business
                days. Events that meet our guidelines will be added to the next calendar update.
              </p>
              <button
                className="se-submit-another"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Event
              </button>
            </div>
          ) : (
            <div className="se-layout">
              <div className="se-form-col">
                <form onSubmit={handleSubmit} className="se-form" noValidate>

                  <div className="se-form-section">
                    <h2 className="se-section-title">Event Details</h2>

                    <div className="se-field">
                      <label htmlFor="event_name">Event Name <span className="se-req">*</span></label>
                      <input
                        type="text"
                        id="event_name"
                        name="event_name"
                        required
                        value={form.event_name}
                        onChange={handleChange}
                        placeholder="e.g., SA Tech Professionals Monthly Mixer"
                      />
                    </div>

                    <div className="se-row">
                      <div className="se-field">
                        <label htmlFor="event_date">Event Date <span className="se-req">*</span></label>
                        <input
                          type="date"
                          id="event_date"
                          name="event_date"
                          required
                          value={form.event_date}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="se-field">
                        <label htmlFor="start_time">Start Time <span className="se-req">*</span></label>
                        <input
                          type="time"
                          id="start_time"
                          name="start_time"
                          required
                          value={form.start_time}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="se-row">
                      <div className="se-field">
                        <label htmlFor="end_time">End Time <span className="se-optional">(optional)</span></label>
                        <input
                          type="time"
                          id="end_time"
                          name="end_time"
                          value={form.end_time}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="se-field">
                        <label htmlFor="city">City <span className="se-req">*</span></label>
                        <div className="se-select-wrap">
                          <select
                            id="city"
                            name="city"
                            required
                            value={form.city}
                            onChange={handleChange}
                          >
                            <option value="">Select a city…</option>
                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronDown size={16} className="se-select-icon" />
                        </div>
                      </div>
                    </div>

                    <div className="se-field">
                      <label htmlFor="category">Event Category <span className="se-req">*</span></label>
                      <div className="se-select-wrap">
                        <select
                          id="category"
                          name="category"
                          required
                          value={form.category}
                          onChange={handleChange}
                        >
                          <option value="">Select a category…</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown size={16} className="se-select-icon" />
                      </div>
                    </div>

                    <div className="se-field">
                      <label htmlFor="description">
                        Event Description <span className="se-req">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        required
                        rows={5}
                        maxLength={500}
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe what attendees can expect — agenda, who it's for, what they'll gain…"
                      />
                      <span className={`se-char-count${charCount > 450 ? ' se-char-warn' : ''}`}>
                        {charCount}/500
                      </span>
                    </div>

                    <div className="se-field">
                      <label htmlFor="event_url">Event URL or Registration Link <span className="se-req">*</span></label>
                      <input
                        type="url"
                        id="event_url"
                        name="event_url"
                        required
                        value={form.event_url}
                        onChange={handleChange}
                        placeholder="https://eventbrite.com/your-event"
                      />
                    </div>
                  </div>

                  <div className="se-form-section">
                    <h2 className="se-section-title">Venue</h2>

                    <div className="se-field">
                      <label htmlFor="venue_name">Venue Name <span className="se-req">*</span></label>
                      <input
                        type="text"
                        id="venue_name"
                        name="venue_name"
                        required
                        value={form.venue_name}
                        onChange={handleChange}
                        placeholder="e.g., The Pearl Stable"
                      />
                    </div>

                    <div className="se-field">
                      <label htmlFor="venue_address">Venue Address <span className="se-req">*</span></label>
                      <input
                        type="text"
                        id="venue_address"
                        name="venue_address"
                        required
                        value={form.venue_address}
                        onChange={handleChange}
                        placeholder="312 Pearl Pkwy, San Antonio, TX 78215"
                      />
                    </div>
                  </div>

                  <div className="se-form-section">
                    <h2 className="se-section-title">Organizer</h2>

                    <div className="se-row">
                      <div className="se-field">
                        <label htmlFor="organizer_name">Organizer Name or Organization <span className="se-req">*</span></label>
                        <input
                          type="text"
                          id="organizer_name"
                          name="organizer_name"
                          required
                          value={form.organizer_name}
                          onChange={handleChange}
                          placeholder="e.g., SA Tech Council"
                        />
                      </div>
                      <div className="se-field">
                        <label htmlFor="contact_email">Contact Email for Confirmation <span className="se-req">*</span></label>
                        <input
                          type="email"
                          id="contact_email"
                          name="contact_email"
                          required
                          value={form.contact_email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="se-form-section">
                    <h2 className="se-section-title">Recurring Event</h2>

                    <div className="se-field">
                      <label>Is this event recurring?</label>
                      <div className="se-toggle-row">
                        <button
                          type="button"
                          className={`se-toggle-btn${!form.is_recurring ? ' active' : ''}`}
                          onClick={() => handleRecurringToggle(false)}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          className={`se-toggle-btn${form.is_recurring ? ' active' : ''}`}
                          onClick={() => handleRecurringToggle(true)}
                        >
                          Yes
                        </button>
                      </div>
                    </div>

                    {form.is_recurring && (
                      <div className="se-field se-field-animate">
                        <label htmlFor="recurring_frequency">Frequency</label>
                        <div className="se-select-wrap">
                          <select
                            id="recurring_frequency"
                            name="recurring_frequency"
                            value={form.recurring_frequency}
                            onChange={handleChange}
                          >
                            <option value="">Select frequency…</option>
                            {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                          <ChevronDown size={16} className="se-select-icon" />
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="se-error">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="se-submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting…' : 'Submit Event for Review'}
                  </button>

                  <p className="se-disclaimer">
                    By submitting, you confirm this is a legitimate business or professional event. We typically review within 2 business days.
                  </p>
                </form>
              </div>

              <aside className="se-sidebar">
                <div className="se-guidelines-card">
                  <div className="se-guidelines-header">
                    <Info size={18} />
                    <h3>Submission Guidelines</h3>
                  </div>
                  <ul className="se-guidelines-list">
                    {GUIDELINES.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>

                <div className="se-sidebar-callout">
                  <p className="se-callout-label">Already on the calendar?</p>
                  <p className="se-callout-text">
                    Browse events for your city to see what's already listed before submitting.
                  </p>
                  <div className="se-callout-links">
                    {CITIES.map(city => (
                      <Link
                        key={city}
                        to={`/texas/${city.toLowerCase().replace(' ', '-')}`}
                        className="se-callout-link"
                      >
                        {city}
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
