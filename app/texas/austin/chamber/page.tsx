import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinChamberPage } from '../../../../src/components/cities/AustinChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'chamber' });
  return (
    <CityProvider>
      <AustinChamberPage initialEvents={events} />
    </CityProvider>
  );
}
