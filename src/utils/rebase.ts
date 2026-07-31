// Re-base local asset paths to the current base (e.g. "/workshop/").
//
// Site content saved while the site lived at the root stores image paths like "/images/x.jpg" or
// "/logo.png". Served under /workshop those resolve to "/images/..." (no prefix) and 404. This walks
// any value (object/array/string) and re-bases local asset paths, leaving absolute URLs
// (http/https/data/blob) and non-asset strings (route paths like "/register") untouched.
//
// Applied at read time only, so stored data is never mutated and the content stays portable.

const BASE = import.meta.env.BASE_URL; // "/workshop/" or "/"
const LOCAL_ASSET = /^\/(images\/|logo\.|logo$|ug-logo)/i;

export function reBaseAssets<T>(value: T): T {
  if (typeof value === "string") {
    return (LOCAL_ASSET.test(value) ? BASE.replace(/\/$/, "") + value : value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => reBaseAssets(v)) as unknown as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, reBaseAssets(v)]),
    ) as T;
  }
  return value;
}
