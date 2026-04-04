import { CityProvider } from '../../../src/contexts/CityContext';
import { HoustonPage } from '../../../src/components/cities/HoustonPage';
import { fetchApprovedEvents } from '../../../src/lib/supabase-server';

export const revalidate = 60;

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston' });
  return (
    <CityProvider>
      <HoustonPage initialEvents={events} />
    </CityProvider>
  );
}
