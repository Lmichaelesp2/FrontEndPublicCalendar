import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export const revalidate = 300;

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

async function getTraining(slug: string): Promise<Training | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('trainings')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return (data as Training) ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  let training: Training | null = null;
  try { training = await getTraining(params.slug); } catch { /* noop */ }
  if (!training) return { title: 'Training | Local Business Calendars' };
  return {
    title: `${training.title} | Local Business Calendars`,
    description: training.description ?? undefined,
  };
}

export default async function TrainingVideoPage({ params }: { params: { slug: string } }) {
  let training: Training | null = null;
  try { training = await getTraining(params.slug); } catch { /* noop */ }
  if (!training) notFound();

  const videoId = youTubeId(training.video_url);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <>
      <Navigation />
      <main>

        {/* Hero */}
        <section style={{ background: '#fff', borderBottom: '1px solid #e8e8e4', padding: '3rem 2rem 2.5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <Link href="/training" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, color: '#475569', textDecoration: 'none', marginBottom: '1.25rem' }}>
              ← All training
            </Link>
            {training.pillar && (
              <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.5rem' }}>
                {training.pillar}
              </p>
            )}
            <h1 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2, color: '#0a1628', marginBottom: '0.5rem' }}>
              {training.title}
            </h1>
            {training.duration_label && (
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0 }}>{training.duration_label}</p>
            )}
          </div>
        </section>

        {/* Video */}
        <section style={{ background: '#f7f7f5', padding: '3rem 2rem' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {embedUrl ? (
              <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: 12, overflow: 'hidden', background: '#000', boxShadow: '0 4px 24px rgba(10,22,40,0.12)' }}>
                <iframe
                  src={embedUrl}
                  title={training.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            ) : training.video_url ? (
              <a href={training.video_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#c2410c', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
                Watch the video →
              </a>
            ) : null}

            {training.description && (
              <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#1f2a3d', marginTop: '2rem' }}>
                {training.description}
              </p>
            )}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#0a1628', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
              Put this into practice.
            </h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '50ch', margin: '0 auto 2rem' }}>
              Find the events where your people already gather — updated every week, free.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/texas" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#c2410c', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                Find events in your city →
              </Link>
              <Link href="/training" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #334155', color: '#cbd5e1', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                ← Back to all training
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
