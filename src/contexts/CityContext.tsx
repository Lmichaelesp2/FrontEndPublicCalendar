'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { City } from '../lib/supabase';
import { getCityBySlug, getSlugForCity } from '../lib/cities';

type CityContextType = {
  selectedCity: City | 'All';
  setSelectedCity: (city: City | 'All') => void;
};

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const citySlug = params?.citySlug as string | undefined;
  const router = useRouter();

  const selectedCity: City | 'All' = citySlug
    ? getCityBySlug(citySlug) ?? 'All'
    : 'All';

  const setSelectedCity = (city: City | 'All') => {
    if (city === 'All') {
      router.push('/texas');
    } else {
      router.push(`/texas/${getSlugForCity(city)}`);
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
