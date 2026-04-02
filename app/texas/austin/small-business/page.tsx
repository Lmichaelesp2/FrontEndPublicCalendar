import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinSmallBusinessPage } from '../../../../src/components/cities/AustinSmallBusinessPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Austin', eventCategory: 'small_business' });
  return (
    <CityProvider>
      <AustinSmallBusinessPage initialEvents={events} />
    </CityProvider>
  );
}
