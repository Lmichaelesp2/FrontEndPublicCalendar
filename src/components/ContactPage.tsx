import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { CalendarPlus, Handshake, HelpCircle, MapPin, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

type InquiryType = 'general' | 'sponsorship' | 'media' | 'technical' | 'other';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'general' as InquiryType,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('contact_inquiries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            inquiry_type: formData.inquiryType,
            message: formData.message,
          },
        ]);

      if (submitError) throw submitError;

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        inquiryType: 'general',
        message: '',
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <SEOHead
        title="Contact Local Business Calendars — Event Submissions, Sponsors & Inquiries"
        description="Have a question or sponsorship inquiry? Contact Local Business Calendars. Event organizers can submit events directly or email us."
      />
      <Navigation />

      <div className="contact-hero">
        <div className="contact-hero-inner">
          <h1>Contact Us</h1>
          <p>
            Have a question, a business event to submit, or a sponsorship inquiry? Use the form below or reach us directly.
          </p>
        </div>
      </div>

      <div className="contact-body">
        <section className="contact-info-section">
          <div className="contact-info-inner">
            <div className="contact-info-grid">
              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <CalendarPlus size={32} strokeWidth={1.5} />
                </div>
                <h3>Submit Events</h3>
                <p>
                  Have a business event to share? Use our <Link to="/submit-event" className="contact-link">Submit Event page</Link> for the fastest response or email us directly. Events are reviewed within 2 business days.
                </p>
                <p className="contact-email">events@localbusinesscalendars.com</p>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Handshake size={32} strokeWidth={1.5} />
                </div>
                <h3>Sponsorships</h3>
                <p>
                  Interested in sponsoring a city calendar? Each calendar has one exclusive sponsor slot. Contact us directly to learn more about partnership opportunities.
                </p>
                <p className="contact-email">sponsors@localbusinesscalendars.com</p>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <HelpCircle size={32} strokeWidth={1.5} />
                </div>
                <h3>Other Questions</h3>
                <p>
                  Have feedback, a media inquiry, or other questions? Fill out the form below and we'll get back to you within 2 business days.
                </p>
                <p className="contact-email">events@localbusinesscalendars.com</p>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <MapPin size={32} strokeWidth={1.5} />
                </div>
                <h3>New City Requests</h3>
                <p>
                  Interested in bringing a local business calendar to your city? We're always looking to expand. Reach out and let us know where you'd like to see us next.
                </p>
                <p className="contact-email">events@localbusinesscalendars.com</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-form-section">
          <div className="contact-form-inner">
            <h2>Send us a Message</h2>

            {submitted && (
              <div className="contact-success-message">
                <p>Thank you — we'll get back to you within 2 business days.</p>
              </div>
            )}

            {error && (
              <div className="contact-error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="inquiryType">Inquiry Type</label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                >
                  <option value="general">General Question</option>
                  <option value="sponsorship">Sponsorship Inquiry</option>
                  <option value="media">Media</option>
                  <option value="technical">Technical Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us more..."
                  rows={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="contact-submit-btn"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
