import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasNetworkingPage } from '../../../../src/components/cities/DallasNetworkingPage';

export default function Page() {
  return (
    <CityProvider>
      <DallasNetworkingPage />
    </CityProvider>
  );
}
