import type { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Training | Local Business Calendars',
  description: 'Free video training on building a network through the events you attend. Short lessons built on the Local Business Networking Method — no login required.',
};

interface Training {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  pillar: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_label: string | null;
  sort_order: number;
  status: string;
  featured: boolean;
  published_at: string | null;
}

function youTubeId(url: string | null): string | null {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function thumbFor(t: Training): string | null {
  if (t.thumbnail_url) return t.thumbnail_url;
  const id = youTubeId(t.video_url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

const PILLAR_COLORS: Record<string, string> = {
  People:        '#c2410c',
  Content:       '#0f6e56',
  Participation: '#1652f0',
  Relationships: '#7c3aed',
};

async function getTrainings(): Promise<Training[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('trainings')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false });
  return (data ?? []) as Training[];
}

export default async function TrainingPage() {
  let trainings: Training[] = [];
  try { trainings = await getTrainings(); } catch { /* table may be empty */ }

  const pillars = ['People', 'Content', 'Participation', 'Relationships'];

  return (
    <>
      <Navigation />
      <main>

        {/* Hero */}
        <section style={{ background: '#fff', borderBottom: '1px solid #e8e8e4', padding: '4rem 2rem 3.5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.75rem' }}>
              Free Training
            </p>
            <h1 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '1.25rem', color: '#0a1628' }}>
              Learn the Local Business Networking Method.
            </h1>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: '#1f2a3d', marginBottom: '2rem', maxWidth: '65ch' }}>
              Short video lessons on building a network through the events you attend. Free, no login required.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/networking-challenge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#c2410c', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                Take the Networking Challenge →
              </Link>
              <Link href="/texas" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #e8e8e4', color: '#1f2a3d', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                Find events in your city
              </Link>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div style={{ background: '#0a1628', padding: '0.85rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>PEOPLE · CONTENT · PARTICIPATION · RELATIONSHIPS</span>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>FREE · NO LOGIN REQUIRED</span>
          </div>
        </div>

        {/* Training grid or coming soon */}
        <section style={{ background: '#f7f7f5', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            {trainings.length > 0 ? (
              <>
                {/* Group by pillar */}
                {pillars.map(pillar => {
                  const group = trainings.filter(t => t.pillar === pillar);
                  if (group.length === 0) return null;
                  return (
                    <div key={pillar} style={{ marginBottom: '3rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: PILLAR_COLORS[pillar] || '#c2410c', display: 'inline-block', flexShrink: 0 }} />
                        <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#0a1628', margin: 0 }}>{pillar}</h2>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {group.map(t => {
                          const thumb = thumbFor(t);
                          return (
                            <Link key={t.id} href={`/training/${t.slug}`} style={{ textDecoration: 'none', background: '#fff', borderRadius: 12, border: '1px solid #e8e8e4', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                              <div style={{ position: 'relative', aspectRatio: '16/9', background: '#0a1628' }}>
                                {thumb && <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,22,40,0.25)' }}>
                                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid #0a1628', marginLeft: '3px' }} />
                                  </div>
                                </div>
                                {t.duration_label && (
                                  <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(10,22,40,0.85)', color: '#fff', fontSize: '0.72rem', fontWeight: 600, padding: '2px 7px', borderRadius: 6 }}>
                                    {t.duration_label}
                                  </span>
                                )}
                              </div>
                              <div style={{ padding: '1.125rem 1.25rem', flex: 1 }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0a1628', marginBottom: '0.4rem', lineHeight: 1.3 }}>{t.title}</h3>
                                {t.description && <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>{t.description}</p>}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Ungrouped */}
                {(() => {
                  const ungrouped = trainings.filter(t => !t.pillar || !pillars.includes(t.pillar));
                  if (ungrouped.length === 0) return null;
                  return (
                    <div>
                      <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#0a1628', marginBottom: '1.5rem' }}>More lessons</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {ungrouped.map(t => {
                          const thumb = thumbFor(t);
                          return (
                            <Link key={t.id} href={`/training/${t.slug}`} style={{ textDecoration: 'none', background: '#fff', borderRadius: 12, border: '1px solid #e8e8e4', overflow: 'hidden' }}>
                              <div style={{ position: 'relative', aspectRatio: '16/9', background: '#0a1628' }}>
                                {thumb && <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,22,40,0.25)' }}>
                                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid #0a1628', marginLeft: '3px' }} />
                                  </div>
                                </div>
                              </div>
                              <div style={{ padding: '1.125rem 1.25rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0a1628', marginBottom: '0.4rem' }}>{t.title}</h3>
                                {t.description && <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>{t.description}</p>}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </>
            ) : (
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e8e4', padding: '3rem 2rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0a1628', marginBottom: '0.5rem' }}>Training videos coming soon.</p>
                <p style={{ color: '#475569', margin: 0 }}>In the meantime, take the Networking Challenge to start applying the method.</p>
                <Link href="/networking-challenge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#c2410c', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', marginTop: '1.5rem' }}>
                  Take the Networking Challenge →
                </Link>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
