import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonNetworkingPage } from '../../../../src/components/cities/HoustonNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', groupType: 'networking' });
  return (
    <CityProvider>
      <HoustonNetworkingPage initialEvents={events} />
    </CityProvider>
  );
}
