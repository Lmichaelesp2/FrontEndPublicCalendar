import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasChamberPage } from '../../../../src/components/cities/DallasChamberPage';

export default function Page() {
  return (
    <CityProvider>
      <DallasChamberPage />
    </CityProvider>
  );
}
