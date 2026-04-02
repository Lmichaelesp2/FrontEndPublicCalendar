import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinChamberPage } from '../../../../src/components/cities/AustinChamberPage';

export default function Page() {
  return (
    <CityProvider>
      <AustinChamberPage />
    </CityProvider>
  );
}
