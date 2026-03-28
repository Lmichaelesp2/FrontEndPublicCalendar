import { useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Breadcrumb } from './components/Breadcrumb';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { HomepageCities } from './components/HomepageCities';
import { SEOHead } from './components/SEOHead';
import { AdminProvider } from './contexts/AdminContext';
import { CityProvider } from './contexts/CityContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminPanel } from './components/admin/AdminPanel';
import { SubmitEventPage } from './components/SubmitEventPage';
import { SocialProof } from './components/SocialProof';
import { FAQ } from './components/FAQ';
import { Plus, Minus } from 'lucide-react';
import { SanAntonioPage } from './components/cities/SanAntonioPage';
import { AustinPage } from './components/cities/AustinPage';
import { DallasPage } from './components/cities/DallasPage';
import { HoustonPage } from './components/cities/HoustonPage';
import { SanAntonioTechnologyPage } from './components/cities/SanAntonioTechnologyPage';
import { SanAntonioRealEstatePage } from './components/cities/SanAntonioRealEstatePage';
import { SanAntonioChamberPage } from './components/cities/SanAntonioChamberPage';
import { SanAntonioSmallBusinessPage } from './components/cities/SanAntonioSmallBusinessPage';
import { SanAntonioNetworkingPage } from './components/cities/SanAntonioNetworkingPage';
import { AustinTechnologyPage } from './components/cities/AustinTechnologyPage';
import { AustinRealEstatePage } from './components/cities/AustinRealEstatePage';
import { AustinNetworkingPage } from './components/cities/AustinNetworkingPage';
import { AustinChamberPage } from './components/cities/AustinChamberPage';
import { AustinSmallBusinessPage } from './components/cities/AustinSmallBusinessPage';
import { DallasTechnologyPage } from './components/cities/DallasTechnologyPage';
import { DallasRealEstatePage } from './components/cities/DallasRealEstatePage';
import { DallasNetworkingPage } from './components/cities/DallasNetworkingPage';
import { DallasChamberPage } from './components/cities/DallasChamberPage';
import { DallasSmallBusinessPage } from './components/cities/DallasSmallBusinessPage';
import { HoustonTechnologyPage } from './components/cities/HoustonTechnologyPage';
import { HoustonRealEstatePage } from './components/cities/HoustonRealEstatePage';
import { HoustonNetworkingPage } from './components/cities/HoustonNetworkingPage';
import { HoustonChamberPage } from './components/cities/HoustonChamberPage';
import { HoustonSmallBusinessPage } from './components/cities/HoustonSmallBusinessPage';
import { SubscribePage } from './components/SubscribePage';
import { Homepage } from './components/Homepage';
import { MapPin, Search, Mail, CalendarDays } from 'lucide-react';

const CITY_NAMES: Record<string, string> = {
  austin: 'Austin',
  'san-antonio': 'San Antonio',
  dallas: 'Dallas',
  houston: 'Houston',
};

function TexasFaqItem({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-trigger" onClick={onToggle} aria-expanded={open}>
        <span>{question}</span>
        {open ? <Minus size={18} /> : <Plus size={18} />}
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
}

const TEXAS_FAQ_ITEMS = [
  {
    question: 'Which cities does Texas Business Calendars cover?',
    answer: 'We currently cover San Antonio, Austin, Dallas, and Houston. Each city has its own dedicated calendar and weekly email newsletter. Click any city above to browse events or subscribe.',
  },
  {
    question: 'Is this free?',
    answer: 'Yes — browsing the calendar and subscribing to the weekly email are both completely free. No credit card, no trial, no catch.',
  },
  {
    question: 'How often are events updated?',
    answer: 'We research and update events every week. New events are added as they\'re published by local organizations, and the weekly newsletter goes out every Monday morning.',
  },
  {
    question: 'How do you find events across Texas?',
    answer: 'We monitor chambers of commerce, local business organizations, Meetup groups, Eventbrite, Facebook, LinkedIn, and dozens of individual organization websites across all four cities — so you don\'t have to.',
  },
];

function MainLayoutInner() {
  const { citySlug } = useParams<{ citySlug?: string }>();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const showIndustryCalendars = citySlug === 'austin' || citySlug === 'dallas' || citySlug === 'houston' || citySlug === 'san-antonio';
  const cityName = citySlug ? (CITY_NAMES[citySlug] ?? citySlug) : undefined;

  const seoTitle = citySlug
    ? `${cityName} Business Calendar | Free Networking & Business Events Newsletter`
    : 'Texas Business Calendars | Free Networking & Business Events Newsletter';

  const seoDescription = citySlug
    ? `Find networking events, business mixers, chamber meetings, and professional development opportunities in ${cityName}, Texas. Updated weekly with the latest events.`
    : 'Explore business calendars for Austin, Dallas, Houston, and San Antonio, Texas. Find networking events, mixers, chamber meetings, and professional opportunities. Free weekly emails.';

  return (
    <div>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
      />
      <Navigation />
      {citySlug && (
        <Breadcrumb items={[
          { label: 'Local Business Calendars', href: '/' },
          { label: 'Texas', href: '/texas' },
          { label: cityName ?? citySlug },
        ]} />
      )}
      <Hero />

        {!citySlug && (
          <section className="hp-intro-section">
            <div className="hp-intro-inner">
              <p>
                Texas Business Calendars aggregates networking events, chamber of commerce meetings, technology meetups, real estate investor gatherings, and small business events across San Antonio, Austin, Dallas, and Houston — researched weekly and delivered free to your inbox every Monday morning.
              </p>
            </div>
          </section>
        )}

        <section className="benefits-bar">
          <div className="benefits-bar-inner">
            <div className="benefit-item">
              <div className="benefit-icon">
                <CalendarDays size={20} strokeWidth={2} />
              </div>
              <span>Events aggregated every week</span>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <Mail size={20} strokeWidth={2} />
              </div>
              <span>Delivered every Monday morning</span>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <span>Access calendar anytime</span>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="features-inner">
            <h2>We Do the Searching So You Don't Have To</h2>
            <p className="features-subtitle">We aggregate sources across Texas so you don't have to — then deliver the best event opportunities straight to your newsletter every Monday.

</p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-step">1</div>
                <h3>Subscribe to your city</h3>
                <p>Click your city above. Enter your email. That's it — no account, no credit card, no setup. Takes 10 seconds.</p>
              </div>

              <div className="feature-card">
                <div className="feature-step">2</div>
                <h3>Get your Monday newsletter</h3>
                <p>Every Monday morning you'll receive a curated digest of that week's networking events, meetups, and business gatherings in your city.</p>
              </div>

              <div className="feature-card">
                <div className="feature-step">3</div>
                <h3>Pick events & show up</h3>
                <p>Scan the list, click the events that fit your schedule, and walk in ready to meet the right people. We handle the research — you handle the relationships.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="why-section">
          <div className="why-inner">
            <h2>Why Use Texas Business Calendars?</h2>
            <p className="why-subtitle">Most professionals miss events because they're scattered across multiple platforms and websites. We bring them together in one city-focused calendar — updated weekly.</p>
            <div className="why-grid">
              <div className="why-card">
                <h3>The problem</h3>
                <p>Events are spread across Eventbrite, Meetup, LinkedIn, Facebook, chambers, and associations. It takes time to find what's worth attending.</p>
              </div>
              <div className="why-card">
                <h3>What we do</h3>
                <p>We track business event hosts and organize their public events into one simple calendar per city.</p>
              </div>
              <div className="why-card">
                <h3>What you get</h3>
                <p>Faster discovery, fewer missed opportunities, and a weekly reminder that keeps you consistent.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="value-section" style={{ paddingTop: '2rem' }}>
          <div className="value-inner">
            <h2>Never Miss an Event That Matters</h2>
            <div className="value-grid">
              <div className="value-card">
                <div className="value-icon"><MapPin size={40} strokeWidth={2} /></div>
                <h3>Get the free weekly newsletter</h3>
                <p>Sign up for your city and get that week's business events in your inbox every Monday. Free.</p>
              </div>
              <div className="value-card">
                <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
                <h3>Check the calendar anytime</h3>
                <p>No signup needed. Browse your city's business events on the calendar whenever you want.</p>
              </div>
              <div className="value-card">
                <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
                <h3>Never miss what matters</h3>
                <p>The email and the calendar work together so you always know what's coming up.</p>
              </div>
            </div>
          </div>
        </section>

        <HomepageCities />
        <SocialProof />
        {!citySlug && (
          <section className="faq-section">
            <div className="faq-inner">
              <h2>Frequently Asked Questions About Texas Business Calendars</h2>
              <div className="faq-list">
                {TEXAS_FAQ_ITEMS.map((item, i) => (
                  <TexasFaqItem
                    key={i}
                    question={item.question}
                    answer={item.answer}
                    open={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
        <FAQ />
        <Footer showIndustryCalendars={showIndustryCalendars} citySlug={citySlug} cityName={cityName} />
      </div>
  );
}

function MainLayout() {
  return (
    <CityProvider>
      <MainLayoutInner />
    </CityProvider>
  );
}

function AdminRoute() {
  return (
    <AdminProvider>
      <AdminPanel />
    </AdminProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/submit" element={<SubmitEventPage />} />
        <Route path="/submit-event" element={<SubmitEventPage />} />
        <Route path="/texas/san-antonio" element={
          <CityProvider>
            <SanAntonioPage />
          </CityProvider>
        } />
        <Route path="/texas/san-antonio/technology" element={
          <CityProvider>
            <SanAntonioTechnologyPage />
          </CityProvider>
        } />
        <Route path="/texas/san-antonio/real-estate" element={
          <CityProvider>
            <SanAntonioRealEstatePage />
          </CityProvider>
        } />
        <Route path="/texas/san-antonio/chamber" element={
          <CityProvider>
            <SanAntonioChamberPage />
          </CityProvider>
        } />
        <Route path="/texas/san-antonio/small-business" element={
          <CityProvider>
            <SanAntonioSmallBusinessPage />
          </CityProvider>
        } />
        <Route path="/texas/san-antonio/networking" element={
          <CityProvider>
            <SanAntonioNetworkingPage />
          </CityProvider>
        } />
        <Route path="/texas/austin" element={
          <CityProvider>
            <AustinPage />
          </CityProvider>
        } />
        <Route path="/texas/dallas" element={
          <CityProvider>
            <DallasPage />
          </CityProvider>
        } />
        <Route path="/texas/houston" element={
          <CityProvider>
            <HoustonPage />
          </CityProvider>
        } />
        <Route path="/texas/austin/technology" element={
          <CityProvider>
            <AustinTechnologyPage />
          </CityProvider>
        } />
        <Route path="/texas/austin/real-estate" element={
          <CityProvider>
            <AustinRealEstatePage />
          </CityProvider>
        } />
        <Route path="/texas/austin/networking" element={
          <CityProvider>
            <AustinNetworkingPage />
          </CityProvider>
        } />
        <Route path="/texas/austin/chamber" element={
          <CityProvider>
            <AustinChamberPage />
          </CityProvider>
        } />
        <Route path="/texas/austin/small-business" element={
          <CityProvider>
            <AustinSmallBusinessPage />
          </CityProvider>
        } />
        <Route path="/texas/dallas/technology" element={
          <CityProvider>
            <DallasTechnologyPage />
          </CityProvider>
        } />
        <Route path="/texas/dallas/real-estate" element={
          <CityProvider>
            <DallasRealEstatePage />
          </CityProvider>
        } />
        <Route path="/texas/dallas/networking" element={
          <CityProvider>
            <DallasNetworkingPage />
          </CityProvider>
        } />
        <Route path="/texas/dallas/chamber" element={
          <CityProvider>
            <DallasChamberPage />
          </CityProvider>
        } />
        <Route path="/texas/dallas/small-business" element={
          <CityProvider>
            <DallasSmallBusinessPage />
          </CityProvider>
        } />
        <Route path="/texas/houston/technology" element={
          <CityProvider>
            <HoustonTechnologyPage />
          </CityProvider>
        } />
        <Route path="/texas/houston/real-estate" element={
          <CityProvider>
            <HoustonRealEstatePage />
          </CityProvider>
        } />
        <Route path="/texas/houston/networking" element={
          <CityProvider>
            <HoustonNetworkingPage />
          </CityProvider>
        } />
        <Route path="/texas/houston/chamber" element={
          <CityProvider>
            <HoustonChamberPage />
          </CityProvider>
        } />
        <Route path="/texas/houston/small-business" element={
          <CityProvider>
            <HoustonSmallBusinessPage />
          </CityProvider>
        } />
        <Route path="/texas/:citySlug/subscribe" element={<SubscribePage />} />
        <Route path="/texas/:citySlug" element={<MainLayout />} />
        <Route path="/texas" element={<MainLayout />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
