import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function extractCloudinaryPublicId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("res.cloudinary.com")) return null;

    const segments = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = segments.findIndex((segment) => segment === "upload");
    if (uploadIndex < 0) return null;

    const afterUpload = segments.slice(uploadIndex + 1);
    if (!afterUpload.length) return null;

    const withoutVersion =
      /^v\d+$/.test(afterUpload[0]) && afterUpload.length > 1
        ? afterUpload.slice(1)
        : afterUpload;

    const joined = withoutVersion.join("/");
    if (!joined) return null;

    return joined.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

export async function deleteCloudinaryAssetByUrl(url: string): Promise<void> {
  const publicId = extractCloudinaryPublicId(url);
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
}

export async function deleteCloudinaryAssetsByUrls(urls: string[]): Promise<void> {
  await Promise.all(
    urls
      .filter((url) => typeof url === "string" && url.trim().length > 0)
      .map((url) => deleteCloudinaryAssetByUrl(url)),
  );
}

