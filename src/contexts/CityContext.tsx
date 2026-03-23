import { createContext, useContext, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { City } from '../lib/supabase';
import { getCityBySlug, getSlugForCity } from '../lib/cities';

type CityContextType = {
  selectedCity: City | 'All';
  setSelectedCity: (city: City | 'All') => void;
};

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const { citySlug } = useParams<{ citySlug?: string }>();
  const navigate = useNavigate();

  const selectedCity: City | 'All' = citySlug
    ? getCityBySlug(citySlug) ?? 'All'
    : 'All';

  const setSelectedCity = (city: City | 'All') => {
    if (city === 'All') {
      navigate('/texas');
    } else {
      navigate(`/texas/${getSlugForCity(city)}`);
    }
  };

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
}
