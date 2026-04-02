import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonTechnologyPage } from '../../../../src/components/cities/HoustonTechnologyPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', eventCategory: 'technology' });
  return (
    <CityProvider>
      <HoustonTechnologyPage initialEvents={events} />
    </CityProvider>
  );
}
