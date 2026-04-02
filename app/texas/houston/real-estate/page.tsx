import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonRealEstatePage } from '../../../../src/components/cities/HoustonRealEstatePage';

export default function Page() {
  return (
    <CityProvider>
      <HoustonRealEstatePage />
    </CityProvider>
  );
}
