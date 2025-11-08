/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to convert
 * @returns A slugified version of the text
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Encodes movie ID to a short hash (base36)
 * @param id - Movie ID
 * @returns Encoded ID string
 */
const encodeId = (id: number): string => {
  return id.toString(36);
};

/**
 * Decodes hash back to movie ID
 * @param hash - Encoded ID string
 * @returns Movie ID or null if invalid
 */
const decodeId = (hash: string): number | null => {
  const id = parseInt(hash, 36);
  return isNaN(id) ? null : id;
};

/**
 * Generates a movie URL with slug (ID hidden in hash)
 * @param id - Movie ID
 * @param title - Movie title
 * @returns URL in format: /movie/{slug}-{hash}
 */
export const getMovieUrl = (id: number, title: string): string => {
  const slug = slugify(title);
  const hash = encodeId(id);
  return `/movie/${slug}-${hash}`;
};

/**
 * Extracts movie ID from URL
 * @param urlParam - URL parameter (e.g., "nome-do-filme-abc123")
 * @returns Movie ID or null if invalid
 */
export const extractMovieId = (urlParam: string): number | null => {
  if (!urlParam) return null;

  // Extract hash from end (last segment after last hyphen)
  // Try to decode from the end, working backwards
  const parts = urlParam.split("-");
  if (parts.length < 2) return null;

  // Try the last segment first
  let hash = parts[parts.length - 1];
  let id = decodeId(hash);

  // If that doesn't work, try combining last 2 segments (in case hash has hyphens)
  if (id === null && parts.length >= 2) {
    hash = parts.slice(-2).join("-");
    id = decodeId(hash);
  }

  return id;
};
