import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonSmallBusinessPage } from '../../../../src/components/cities/HoustonSmallBusinessPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', eventCategory: 'small_business' });
  return (
    <CityProvider>
      <HoustonSmallBusinessPage initialEvents={events} />
    </CityProvider>
  );
}
