import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioChamberPage } from '../../../../src/components/cities/SanAntonioChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', eventCategory: 'chamber' });
  return (
    <CityProvider>
      <SanAntonioChamberPage initialEvents={events} />
    </CityProvider>
  );
}
