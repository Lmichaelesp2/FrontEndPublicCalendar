import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioRealEstatePage } from '../../../../src/components/cities/SanAntonioRealEstatePage';

export default function Page() {
  return (
    <CityProvider>
      <SanAntonioRealEstatePage />
    </CityProvider>
  );
}
