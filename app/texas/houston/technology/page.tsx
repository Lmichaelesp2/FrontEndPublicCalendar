import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonTechnologyPage } from '../../../../src/components/cities/HoustonTechnologyPage';

export default function Page() {
  return (
    <CityProvider>
      <HoustonTechnologyPage />
    </CityProvider>
  );
}
