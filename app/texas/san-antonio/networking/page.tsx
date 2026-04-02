import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioNetworkingPage } from '../../../../src/components/cities/SanAntonioNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', eventCategory: 'networking' });
  return (
    <CityProvider>
      <SanAntonioNetworkingPage initialEvents={events} />
    </CityProvider>
  );
}
