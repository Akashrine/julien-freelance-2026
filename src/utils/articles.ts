export function getCategoryLabel(category: string): string {
  return category === 'reflexion' ? 'Réflexion' : 'Analyse';
}

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export interface TocHeading {
  id: string;
  text: string;
  depth: number;
}

/**
 * Extracts heading data from MDX body by parsing component props.
 * Handles <Section>, <ColorBlock>, and <ClosingBlock> components.
 */
export function extractHeadingsFromMDX(body: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const componentRegex = /<(Section|ColorBlock|ClosingBlock)\s([^>]*?)>/g;
  const seen = new Set<string>();

  let match;
  while ((match = componentRegex.exec(body)) !== null) {
    const props = match[2];
    const labelMatch = props.match(/label="([^"]*)"/);
    const titleMatch = props.match(/title="([^"]*)"/);
    const display = labelMatch?.[1] || titleMatch?.[1];
    if (!display) continue;
    const id = slugify(display);
    if (seen.has(id)) continue;
    seen.add(id);
    headings.push({ id, text: display, depth: 2 });
  }

  return headings;
}
