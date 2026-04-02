import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasTechnologyPage } from '../../../../src/components/cities/DallasTechnologyPage';

export default function Page() {
  return (
    <CityProvider>
      <DallasTechnologyPage />
    </CityProvider>
  );
}
