"use client";

export async function uploadToCloudinary(file: File): Promise<string> {
  if (!(file instanceof File)) throw new Error("No file provided or invalid type");

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (!allowedTypes.includes(file.type)) throw new Error("Only images or PDFs allowed");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/cloudinary/upload", { method: "POST", body: formData });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Cloudinary API error:", errorText);
    throw new Error("Cloudinary upload failed: " + errorText);
  }

  const data: { url?: string; secure_url?: string } = await res.json();
  return data.url ?? data.secure_url ?? "";
}
