import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinTechnologyPage } from '../../../../src/components/cities/AustinTechnologyPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Austin', eventCategory: 'technology' });
  return (
    <CityProvider>
      <AustinTechnologyPage initialEvents={events} />
    </CityProvider>
  );
}
