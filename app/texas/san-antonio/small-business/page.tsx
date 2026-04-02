import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioSmallBusinessPage } from '../../../../src/components/cities/SanAntonioSmallBusinessPage';

export default function Page() {
  return (
    <CityProvider>
      <SanAntonioSmallBusinessPage />
    </CityProvider>
  );
}
