import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioSmallBusinessPage } from '../../../../src/components/cities/SanAntonioSmallBusinessPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', groupType: 'small_business' });
  return (
    <CityProvider>
      <SanAntonioSmallBusinessPage initialEvents={events} />
    </CityProvider>
  );
}
