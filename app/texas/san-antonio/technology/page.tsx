import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioTechnologyPage } from '../../../../src/components/cities/SanAntonioTechnologyPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', eventCategory: 'technology' });
  return (
    <CityProvider>
      <SanAntonioTechnologyPage initialEvents={events} />
    </CityProvider>
  );
}
