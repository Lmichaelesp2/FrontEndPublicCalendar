import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioChamberPage } from '../../../../src/components/cities/SanAntonioChamberPage';

export default function Page() {
  return (
    <CityProvider>
      <SanAntonioChamberPage />
    </CityProvider>
  );
}
