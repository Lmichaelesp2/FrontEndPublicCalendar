import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioRealEstatePage } from '../../../../src/components/cities/SanAntonioRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', groupType: 'real_estate' });
  return (
    <CityProvider>
      <SanAntonioRealEstatePage initialEvents={events} />
    </CityProvider>
  );
}
