import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinRealEstatePage } from '../../../../src/components/cities/AustinRealEstatePage';

export default function Page() {
  return (
    <CityProvider>
      <AustinRealEstatePage />
    </CityProvider>
  );
}
