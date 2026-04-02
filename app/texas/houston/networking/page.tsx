import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonNetworkingPage } from '../../../../src/components/cities/HoustonNetworkingPage';

export default function Page() {
  return (
    <CityProvider>
      <HoustonNetworkingPage />
    </CityProvider>
  );
}
