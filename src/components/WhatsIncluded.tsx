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
              <i className="ti ti-check check-icon" aria-hidden="true" />
              <span>{eventType}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
