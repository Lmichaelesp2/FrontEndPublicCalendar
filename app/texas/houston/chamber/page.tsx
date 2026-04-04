import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonChamberPage } from '../../../../src/components/cities/HoustonChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', groupType: 'chamber' });
  return (
    <CityProvider>
      <HoustonChamberPage initialEvents={events} />
    </CityProvider>
  );
}
