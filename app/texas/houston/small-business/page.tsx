import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonSmallBusinessPage } from '../../../../src/components/cities/HoustonSmallBusinessPage';

export default function Page() {
  return (
    <CityProvider>
      <HoustonSmallBusinessPage />
    </CityProvider>
  );
}
