import { CityProvider } from '../../../src/contexts/CityContext';
import { SanAntonioPage } from '../../../src/components/cities/SanAntonioPage';
import { fetchApprovedEvents } from '../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio' });
  return (
    <CityProvider>
      <SanAntonioPage initialEvents={events} />
    </CityProvider>
  );
}
