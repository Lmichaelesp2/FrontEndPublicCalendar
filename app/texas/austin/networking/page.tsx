import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinNetworkingPage } from '../../../../src/components/cities/AustinNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'networking' });
  return (
    <CityProvider>
      <AustinNetworkingPage initialEvents={events} />
    </CityProvider>
  );
}
