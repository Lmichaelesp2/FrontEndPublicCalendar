import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasRealEstatePage } from '../../../../src/components/cities/DallasRealEstatePage';

export default function Page() {
  return (
    <CityProvider>
      <DallasRealEstatePage />
    </CityProvider>
  );
}
