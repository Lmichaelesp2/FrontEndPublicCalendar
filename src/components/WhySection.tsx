'use client';
import { AlertTriangle, Target, Star } from 'lucide-react';

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
        <h2>{heading}</h2>
        <p className="why-subtitle">{subtitle}</p>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-card-icon"><AlertTriangle size={26} strokeWidth={2} /></div>
            <h3>The problem</h3>
            <p>{problemText}</p>
          </div>
          <div className="why-card">
            <div className="why-card-icon"><Target size={26} strokeWidth={2} /></div>
            <h3>What we do</h3>
            <p>{whatWeDoText}</p>
          </div>
          <div className="why-card">
            <div className="why-card-icon"><Star size={26} strokeWidth={2} /></div>
            <h3>What you get</h3>
            <p>{whatYouGetText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
