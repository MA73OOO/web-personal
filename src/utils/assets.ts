/**
 * Resolves local public assets to CDN assets if NEXT_PUBLIC_CDN_URL is configured.
 * This pattern allows hosting assets locally in the "public" folder during early development
 * and seamlessly transitioning to an external AWS S3 CDN in production.
 * 
 * @param path - The asset path relative to the public folder (e.g. "/images/photo.png" or "/Mateo_Henao_Rangel_CV.pdf")
 */
export function getAssetUrl(path: string): string {
  if (!path) return "";

  // If it is already an absolute external link, return it as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
  if (cdnUrl) {
    // Strip trailing slash from CDN and leading slash from path to avoid double slashes
    const cleanCdn = cdnUrl.endsWith("/") ? cdnUrl.slice(0, -1) : cdnUrl;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanCdn}${cleanPath}`;
  }

  return path;
}
