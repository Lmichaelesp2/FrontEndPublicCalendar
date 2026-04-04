import { CityProvider } from '../../../src/contexts/CityContext';
import { DallasPage } from '../../../src/components/cities/DallasPage';
import { fetchApprovedEvents } from '../../../src/lib/supabase-server';

export const revalidate = 60;

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas' });
  return (
    <CityProvider>
      <DallasPage initialEvents={events} />
    </CityProvider>
  );
}
