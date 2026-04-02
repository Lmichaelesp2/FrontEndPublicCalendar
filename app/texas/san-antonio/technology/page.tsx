import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioTechnologyPage } from '../../../../src/components/cities/SanAntonioTechnologyPage';

export default function Page() {
  return (
    <CityProvider>
      <SanAntonioTechnologyPage />
    </CityProvider>
  );
}
