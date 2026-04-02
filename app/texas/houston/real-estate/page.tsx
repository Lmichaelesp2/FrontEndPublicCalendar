import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonRealEstatePage } from '../../../../src/components/cities/HoustonRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', eventCategory: 'real_estate' });
  return (
    <CityProvider>
      <HoustonRealEstatePage initialEvents={events} />
    </CityProvider>
  );
}
