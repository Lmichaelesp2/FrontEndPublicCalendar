import { Routes, Route, useParams } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { HomepageCities } from './components/HomepageCities';
import { AdminProvider } from './contexts/AdminContext';
import { CityProvider } from './contexts/CityContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminPanel } from './components/admin/AdminPanel';
import { SubmitEventPage } from './components/SubmitEventPage';
import { EventAssistantBanner } from './components/EventAssistantBanner';
import { SocialProof } from './components/SocialProof';
import { FAQ } from './components/FAQ';
import { WhatsIncluded } from './components/WhatsIncluded';
import { SanAntonioPage } from './components/cities/SanAntonioPage';
import { SanAntonioTechnologyPage } from './components/cities/SanAntonioTechnologyPage';
import { SanAntonioRealEstatePage } from './components/cities/SanAntonioRealEstatePage';
import { SanAntonioChamberPage } from './components/cities/SanAntonioChamberPage';
import { SanAntonioSmallBusinessPage } from './components/cities/SanAntonioSmallBusinessPage';
import { SubscribePage } from './components/SubscribePage';
import { CityLoginBanner } from './components/CityLoginBanner';
import { getCityConfig } from './lib/cities';
import { MapPin, Search, Mail, CalendarDays } from 'lucide-react';

function MainLayoutInner() {
  const { citySlug } = useParams<{ citySlug?: string }>();
  const cityConfig = citySlug ? getCityConfig(citySlug) : null;

  return (
    <div>
      <Navigation />
      {cityConfig && <CityLoginBanner cityName={cityConfig.name} />}
      <Hero />

        <section className="value-section">
          <div className="value-inner">
            <h2>We Do the Searching So You Don't Have To</h2>
            <p>Business events in your city are scattered across multiple sites. They take time to find. We bring them together for you.</p>
          </div>
        </section>

        <section className="sa-value-strip">
          <div className="sa-value-strip-inner">
            <div className="sa-value-strip-item">
              <div className="sa-strip-icon"><CalendarDays size={28} strokeWidth={1.8} /></div>
              <div>
                <strong>Already Aggregated</strong>
                <p>We track organizations so you don't have to check dozens of websites. Every event is already here.</p>
              </div>
            </div>
            <div className="sa-value-strip-item">
              <div className="sa-strip-icon"><Search size={28} strokeWidth={1.8} /></div>
              <div>
                <strong>Easy-to-Use Calendar</strong>
                <p>Browse events by day, search by keyword, and find exactly what you're looking for — fast.</p>
              </div>
            </div>
            <div className="sa-value-strip-item">
              <div className="sa-strip-icon"><Mail size={28} strokeWidth={1.8} /></div>
              <div>
                <strong>Weekly Event Reminder</strong>
                <p>Every Monday, the week's events land in your inbox. Plan your networking before the week even starts.</p>
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
            <h2>How It Works</h2>
            <div className="value-grid">
              <div className="value-card">
                <div className="value-icon"><MapPin size={40} strokeWidth={2} /></div>
                <h3>Choose your city</h3>
                <p>Pick San Antonio, Austin, Dallas, or Houston.</p>
              </div>
              <div className="value-card">
                <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
                <h3>Browse this week's events</h3>
                <p>Use the calendar or search by keyword to find what's relevant.</p>
              </div>
              <div className="value-card">
                <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
                <h3>Get weekly reminders</h3>
                <p>Subscribe free and get a Monday email with opportunities.</p>
              </div>
            </div>
          </div>
        </section>

        <WhatsIncluded />
        <HomepageCities />
        <SocialProof />
        <FAQ />
        <Footer />
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
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/submit" element={<SubmitEventPage />} />
        <Route path="/san-antonio" element={
          <CityProvider>
            <SanAntonioPage />
          </CityProvider>
        } />
        <Route path="/san-antonio/technology" element={
          <CityProvider>
            <SanAntonioTechnologyPage />
          </CityProvider>
        } />
        <Route path="/san-antonio/real-estate" element={
          <CityProvider>
            <SanAntonioRealEstatePage />
          </CityProvider>
        } />
        <Route path="/san-antonio/chamber" element={
          <CityProvider>
            <SanAntonioChamberPage />
          </CityProvider>
        } />
        <Route path="/san-antonio/small-business" element={
          <CityProvider>
            <SanAntonioSmallBusinessPage />
          </CityProvider>
        } />
        <Route path="/:citySlug/subscribe" element={<SubscribePage />} />
        <Route path="/:citySlug" element={<MainLayout />} />
        <Route path="/" element={<MainLayout />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
