import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonChamberPage } from '../../../../src/components/cities/HoustonChamberPage';

export default function Page() {
  return (
    <CityProvider>
      <HoustonChamberPage />
    </CityProvider>
  );
}
