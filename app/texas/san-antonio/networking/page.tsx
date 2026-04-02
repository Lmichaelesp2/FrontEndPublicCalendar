import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioNetworkingPage } from '../../../../src/components/cities/SanAntonioNetworkingPage';

export default function Page() {
  return (
    <CityProvider>
      <SanAntonioNetworkingPage />
    </CityProvider>
  );
}
