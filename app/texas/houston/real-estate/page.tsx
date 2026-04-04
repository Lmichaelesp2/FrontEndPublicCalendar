import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonRealEstatePage } from '../../../../src/components/cities/HoustonRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', groupType: 'real_estate' });
  return (
    <CityProvider>
      <HoustonRealEstatePage initialEvents={events} />
    </CityProvider>
  );
}
