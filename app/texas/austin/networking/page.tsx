import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinNetworkingPage } from '../../../../src/components/cities/AustinNetworkingPage';

export default function Page() {
  return (
    <CityProvider>
      <AustinNetworkingPage />
    </CityProvider>
  );
}
