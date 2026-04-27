import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { getProgrammaticDoc, getProgrammaticSlugs } from '@/lib/programmatic-seo'

export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  return getProgrammaticSlugs('attack-type').map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const doc = getProgrammaticDoc('attack-type', slug)
  if (!doc) return {}

  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/attack-type/${slug}` },
  }
}

function renderInline(input: string): string {
  return input
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#003ec7] underline hover:no-underline">$1</a>')
}

export default async function AttackTypeProgrammaticPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = getProgrammaticDoc('attack-type', slug)
  if (!doc) notFound()

  const lines = doc.body.split('\n')
  const content = lines.filter(line => line.trim().length > 0 && line.trim() !== '---')

  return (
    <MarketingSeoShell>
      <article className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">
          <Link href="/prevent" className="hover:underline">
            Attack-type guide
          </Link>
        </p>

        <div className="mt-8 space-y-6 text-slate-700">
          {content.map((line, idx) => {
            if (line.startsWith('# ')) {
              return (
                <h1 key={idx} className="font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
                  {line.replace(/^#\s+/, '')}
                </h1>
              )
            }
            if (line.startsWith('## ')) {
              return (
                <h2 key={idx} className="pt-4 font-manrope text-2xl font-bold text-[#0b1c30] md:text-3xl">
                  {line.replace(/^##\s+/, '')}
                </h2>
              )
            }
            if (line.startsWith('- ')) {
              return (
                <p
                  key={idx}
                  className="pl-5 text-base leading-relaxed before:mr-2 before:content-['•']"
                  dangerouslySetInnerHTML={{ __html: renderInline(line.replace(/^- /, '')) }}
                />
              )
            }
            return (
              <p
                key={idx}
                className="text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderInline(line) }}
              />
            )
          })}
        </div>
      </article>
    </MarketingSeoShell>
  )
}
