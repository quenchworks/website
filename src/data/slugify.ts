// The single category-slug helper used everywhere a category name becomes a URL
// segment or anchor id (category routes, detail-page category links).
// Keeping it in one place guarantees the links a
// detail page builds match the paths the category routes emit.
//
// "Object storage" -> "object-storage".
export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
