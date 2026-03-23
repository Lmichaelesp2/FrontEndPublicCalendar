import { Routes, Route } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminPanel } from './components/admin/AdminPanel';
import { SubmitEventPage } from './components/SubmitEventPage';
import { SanAntonioPage } from './components/cities/SanAntonioPage';
import { SanAntonioTechnologyPage } from './components/cities/SanAntonioTechnologyPage';
import { SanAntonioRealEstatePage } from './components/cities/SanAntonioRealEstatePage';
import { SanAntonioChamberPage } from './components/cities/SanAntonioChamberPage';
import { SanAntonioSmallBusinessPage } from './components/cities/SanAntonioSmallBusinessPage';
import { SubscribePage } from './components/SubscribePage';
import { LocalBusinessCalendarsHome } from './components/LocalBusinessCalendarsHome';
import { TexasPage } from './components/TexasPage';
import { CityProvider } from './contexts/CityContext';

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
        <Route path="/" element={<LocalBusinessCalendarsHome />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/submit" element={<SubmitEventPage />} />
        <Route path="/texas" element={<TexasPage />} />
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
        <Route path="/texas/:citySlug/subscribe" element={<SubscribePage />} />
        <Route path="/texas/:citySlug" element={<TexasPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
