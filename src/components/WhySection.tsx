'use client';

interface WhySectionProps {
  heading: string;
  subtitle: string;
  problemText: string;
  whatWeDoText: string;
  whatYouGetText: string;
}

export function WhySection({
  heading,
  subtitle,
  problemText,
  whatWeDoText,
  whatYouGetText,
}: WhySectionProps) {
  return (
    <section className="why-section">
      <div className="why-inner">
        <div className="why-header">
          <h2>
            Business events are scattered.{' '}
            <em>We pull them together.</em>
          </h2>
          <p className="why-subtitle">{subtitle}</p>
        </div>

        <div className="why-columns">
          <div className="why-col">
            <div className="why-col-num">01</div>
            <h3>The problem</h3>
            <p>{problemText}</p>
          </div>
          <div className="why-col">
            <div className="why-col-num">02</div>
            <h3>What we do</h3>
            <p>{whatWeDoText}</p>
          </div>
          <div className="why-col">
            <div className="why-col-num">03</div>
            <h3>What you get</h3>
            <p>{whatYouGetText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
