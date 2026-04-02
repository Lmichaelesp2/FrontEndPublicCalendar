import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinRealEstatePage } from '../../../../src/components/cities/AustinRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Austin', eventCategory: 'real_estate' });
  return (
    <CityProvider>
      <AustinRealEstatePage initialEvents={events} />
    </CityProvider>
  );
}
