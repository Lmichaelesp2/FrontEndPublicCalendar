import { City } from './supabase';

export type CityConfig = {
  slug: string;
  name: City;
  title: string;
  description: string;
  h1: string;
  heroSub: string;
};

export const CITY_CONFIGS: CityConfig[] = [
  {
    slug: 'san-antonio',
    name: 'San Antonio',
    title: 'Networking & Business Events in San Antonio, TX | Texas Business Calendars',
    description: 'Find networking events, business mixers, chamber meetings, and professional development opportunities in San Antonio, Texas. Updated weekly with the latest events.',
    h1: 'Networking & Business Events in San Antonio, TX',
    heroSub: 'Chamber events, business mixers, lunch-and-learns, and professional networking — all gathered from top San Antonio organizations and delivered to your calendar.',
  },
  {
    slug: 'austin',
    name: 'Austin',
    title: 'Networking & Business Events in Austin, TX | Texas Business Calendars',
    description: 'Find networking events, business mixers, chamber meetings, and professional development opportunities in Austin, Texas. Updated weekly with the latest events.',
    h1: 'Networking & Business Events in Austin, TX',
    heroSub: 'Tech meetups, chamber events, business mixers, and professional networking — all gathered from top Austin organizations and delivered to your calendar.',
  },
  {
    slug: 'dallas',
    name: 'Dallas',
    title: 'Networking & Business Events in Dallas, TX | Texas Business Calendars',
    description: 'Find networking events, business mixers, chamber meetings, and professional development opportunities in Dallas, Texas. Updated weekly with the latest events.',
    h1: 'Networking & Business Events in Dallas, TX',
    heroSub: 'Chamber events, business mixers, lunch-and-learns, and professional networking — all gathered from top Dallas organizations and delivered to your calendar.',
  },
  {
    slug: 'houston',
    name: 'Houston',
    title: 'Networking & Business Events in Houston, TX | Texas Business Calendars',
    description: 'Find networking events, business mixers, chamber meetings, and professional development opportunities in Houston, Texas. Updated weekly with the latest events.',
    h1: 'Networking & Business Events in Houston, TX',
    heroSub: 'Chamber events, business mixers, lunch-and-learns, and professional networking — all gathered from top Houston organizations and delivered to your calendar.',
  },
];

export const HOME_SEO = {
  title: 'Networking & Business Events in San Antonio, Austin, Dallas & Houston | Texas Business Calendars',
  description: 'Find networking events, business mixers, and professional development across San Antonio, Austin, Dallas, and Houston. Updated weekly with events from top Texas business organizations.',
  h1: 'Networking & Business Events in San Antonio, Austin, Dallas, and Houston',
  heroSub: 'Never miss an event again. We gather them all in one place so you don\u2019t have to.',
};

export function getCityBySlug(slug: string): City | null {
  const config = CITY_CONFIGS.find((c) => c.slug === slug);
  return config?.name ?? null;
}

export function getSlugForCity(city: City): string {
  const config = CITY_CONFIGS.find((c) => c.name === city);
  return config?.slug ?? '';
}

export function getCityConfig(slug: string): CityConfig | null {
  return CITY_CONFIGS.find((c) => c.slug === slug) ?? null;
}
