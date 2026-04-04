import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasRealEstatePage } from '../../../../src/components/cities/DallasRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'real_estate' });
  return (
    <CityProvider>
      <DallasRealEstatePage initialEvents={events} />
    </CityProvider>
  );
}
