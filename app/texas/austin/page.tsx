import { CityProvider } from '../../../src/contexts/CityContext';
import { AustinPage } from '../../../src/components/cities/AustinPage';
import { fetchApprovedEvents } from '../../../src/lib/supabase-server';

export const revalidate = 60;

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Austin' });
  return (
    <CityProvider>
      <AustinPage initialEvents={events} />
    </CityProvider>
  );
}
