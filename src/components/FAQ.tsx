import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'Is this really free?',
    answer:
      'Yes! The calendar and weekly email are completely free — no credit card required. We also offer a Personal Event Assistant for professionals who want AI-powered event recommendations tailored to their industry and goals.',
  },
  {
    question: 'What cities do you cover?',
    answer:
      'We currently cover San Antonio, Austin, Dallas, and Houston. Each city has its own dedicated calendar with local events, or you can browse all four cities from one page.',
  },
  {
    question: 'Where do you find the events?',
    answer:
      'We aggregate events from top business organizations, chambers of commerce, Meetup, Eventbrite, Facebook, Google, and dozens of local sources — so you don\'t have to check multiple sites.',
  },
  {
    question: 'How is this different from Eventbrite or Meetup?',
    answer:
      'Those platforms only show events posted on their own site. We gather networking and business events from all major platforms and local organizations into one calendar, giving you a complete picture of what\'s happening in your city.',
  },
  {
    question: 'What do I get with a free subscription?',
    answer:
      'Access to your city\'s full events calendar plus a weekly email every Monday with the best upcoming networking and business events in your area.',
  },
  {
    question: 'What is the Personal Event Assistant?',
    answer:
      'It\'s an upcoming AI-powered tool that learns your industry, professional goals, and schedule to recommend the best events for you personally — so you spend less time searching and more time networking. Join the waitlist above to be first in line when it launches.',
  },
  {
    question: 'Can I add my own event?',
    answer:
      'Yes! Use our Submit Event page to add your networking or business event to the calendar for free.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="faq-section">
      <div className="faq-inner">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`faq-item${openIndex === i ? ' open' : ''}`}>
              <button className="faq-trigger" onClick={() => toggle(i)} aria-expanded={openIndex === i}>
                <span>{item.question}</span>
                {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
