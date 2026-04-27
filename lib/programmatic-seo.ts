import fs from 'node:fs'
import path from 'node:path'

export type ProgrammaticCategory = 'industry' | 'erp' | 'attack-type'

export type ProgrammaticDoc = {
  slug: string
  title: string
  description: string
  body: string
}

const ROOT = path.join(process.cwd(), 'programmatic-seo')

function parseFrontmatter(raw: string): { frontmatter: Record<string, string>; body: string } {
  if (!raw.startsWith('---')) {
    return { frontmatter: {}, body: raw }
  }

  const parts = raw.split('---')
  if (parts.length < 3) {
    return { frontmatter: {}, body: raw }
  }

  const fmRaw = parts[1] ?? ''
  const body = parts.slice(2).join('---').trim()
  const frontmatter: Record<string, string> = {}

  for (const line of fmRaw.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    if (key) frontmatter[key] = value
  }

  return { frontmatter, body }
}

export function getProgrammaticSlugs(category: ProgrammaticCategory): string[] {
  const dir = path.join(ROOT, category)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''))
}

export function getProgrammaticDoc(category: ProgrammaticCategory, slug: string): ProgrammaticDoc | null {
  const filePath = path.join(ROOT, category, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { frontmatter, body } = parseFrontmatter(raw)
  const title = frontmatter.meta_title || body.split('\n').find(line => line.startsWith('# '))?.replace(/^#\s+/, '') || 'Vantirs'
  const description = frontmatter.meta_description || body.split('\n').find(line => line.trim().length > 0 && !line.startsWith('#')) || ''

  return {
    slug: frontmatter.slug || slug,
    title,
    description,
    body,
  }
}

export function getProgrammaticPaths(): string[] {
  const categories: ProgrammaticCategory[] = ['industry', 'erp', 'attack-type']
  const paths: string[] = []

  for (const category of categories) {
    for (const slug of getProgrammaticSlugs(category)) {
      paths.push(`/${category}/${slug}`)
    }
  }

  return paths
}
