import { CheckCircle } from 'lucide-react';

export function WhatsIncluded() {
  const eventTypes = [
    'Business networking events',
    'Industry meetups',
    'Professional workshops',
    'Chamber and association events',
    'Educational business sessions',
    'Entrepreneur and startup gatherings'
  ];

  return (
    <section className="whats-included-section">
      <div className="whats-included-inner">
        <h2>What's Included</h2>
        <p className="whats-included-subtitle">
          Each city calendar includes a mix of networking and professional events, such as:
        </p>
        <div className="event-types-list">
          {eventTypes.map((eventType, index) => (
            <div key={index} className="event-type-item">
              <CheckCircle className="check-icon" size={24} strokeWidth={2.5} />
              <span>{eventType}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
