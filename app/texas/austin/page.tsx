import { CityProvider } from '../../../src/contexts/CityContext';
import { AustinPage } from '../../../src/components/cities/AustinPage';

export default function Page() {
  return (
    <CityProvider>
      <AustinPage />
    </CityProvider>
  );
}
