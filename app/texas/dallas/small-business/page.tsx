import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasSmallBusinessPage } from '../../../../src/components/cities/DallasSmallBusinessPage';

export default function Page() {
  return (
    <CityProvider>
      <DallasSmallBusinessPage />
    </CityProvider>
  );
}
