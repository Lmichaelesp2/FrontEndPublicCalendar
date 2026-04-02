import { CityProvider } from '../../../src/contexts/CityContext';
import { DallasPage } from '../../../src/components/cities/DallasPage';

export default function Page() {
  return (
    <CityProvider>
      <DallasPage />
    </CityProvider>
  );
}
