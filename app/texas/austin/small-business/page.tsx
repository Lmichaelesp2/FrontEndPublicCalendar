import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinSmallBusinessPage } from '../../../../src/components/cities/AustinSmallBusinessPage';

export default function Page() {
  return (
    <CityProvider>
      <AustinSmallBusinessPage />
    </CityProvider>
  );
}
