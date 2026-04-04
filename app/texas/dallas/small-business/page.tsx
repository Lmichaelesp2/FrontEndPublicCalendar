import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasSmallBusinessPage } from '../../../../src/components/cities/DallasSmallBusinessPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'small_business' });
  return (
    <CityProvider>
      <DallasSmallBusinessPage initialEvents={events} />
    </CityProvider>
  );
}
