import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';
import { EventSubmission } from './EventSubmission';
import { Footer } from './Footer';
import { ArrowLeft } from 'lucide-react';

export function SubmitEventPage() {
  return (
    <div>
      <Navigation />
      <div className="submit-page-hero">
        <div className="submit-page-hero-inner">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            Back to Calendar
          </Link>
          <h1>Submit Your Event</h1>
          <p>Share your networking or business event with the Texas business community. Submitted events will be reviewed before appearing on the calendar.</p>
        </div>
      </div>
      <EventSubmission />
      <Footer />
    </div>
  );
}
