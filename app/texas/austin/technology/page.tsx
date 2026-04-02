import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinTechnologyPage } from '../../../../src/components/cities/AustinTechnologyPage';

export default function Page() {
  return (
    <CityProvider>
      <AustinTechnologyPage />
    </CityProvider>
  );
}
