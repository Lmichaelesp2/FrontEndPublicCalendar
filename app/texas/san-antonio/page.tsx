import { CityProvider } from '../../../src/contexts/CityContext';
import { SanAntonioPage } from '../../../src/components/cities/SanAntonioPage';

export default function Page() {
  return (
    <CityProvider>
      <SanAntonioPage />
    </CityProvider>
  );
}
