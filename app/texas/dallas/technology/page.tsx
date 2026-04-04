import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasTechnologyPage } from '../../../../src/components/cities/DallasTechnologyPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'technology' });
  return (
    <CityProvider>
      <DallasTechnologyPage initialEvents={events} />
    </CityProvider>
  );
}
