import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasChamberPage } from '../../../../src/components/cities/DallasChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', eventCategory: 'chamber' });
  return (
    <CityProvider>
      <DallasChamberPage initialEvents={events} />
    </CityProvider>
  );
}
