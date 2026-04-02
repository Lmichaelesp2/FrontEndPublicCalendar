import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasRealEstatePage } from '../../../../src/components/cities/DallasRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', eventCategory: 'real_estate' });
  return (
    <CityProvider>
      <DallasRealEstatePage initialEvents={events} />
    </CityProvider>
  );
}
