import { CityProvider } from '../../../src/contexts/CityContext';
import { HoustonPage } from '../../../src/components/cities/HoustonPage';

export default function Page() {
  return (
    <CityProvider>
      <HoustonPage />
    </CityProvider>
  );
}
