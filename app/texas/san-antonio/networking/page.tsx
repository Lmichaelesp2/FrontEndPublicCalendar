import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioNetworkingPage } from '../../../../src/components/cities/SanAntonioNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', groupType: 'networking' });
  return (
    <CityProvider>
      <SanAntonioNetworkingPage initialEvents={events} />
    </CityProvider>
  );
}
