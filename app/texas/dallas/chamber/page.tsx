import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasChamberPage } from '../../../../src/components/cities/DallasChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'chamber' });
  return (
    <CityProvider>
      <DallasChamberPage initialEvents={events} />
    </CityProvider>
  );
}
