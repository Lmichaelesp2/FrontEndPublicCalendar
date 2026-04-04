import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasNetworkingPage } from '../../../../src/components/cities/DallasNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'networking' });
  return (
    <CityProvider>
      <DallasNetworkingPage initialEvents={events} />
    </CityProvider>
  );
}
