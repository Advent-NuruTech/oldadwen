import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

/* ================================
   Cloudinary Config (SERVER ONLY)
================================ */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!, // da8kzhxwh
  api_key: process.env.CLOUDINARY_API_KEY!,       // 343474372244282
  api_secret: process.env.CLOUDINARY_API_SECRET!, // yqLZdfokZywOmXc4XhE
});

/* ================================
   POST: Upload Blog Image
================================ */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    /* Convert File → Buffer */
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    /* Upload using stream (BEST PRACTICE) */
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "edenlife/blog",
              upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET, // nuru
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as { secure_url: string });
            }
          )
          .end(buffer);
      }
    );

    return NextResponse.json({
      url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Image upload failed" },
      { status: 500 }
    );
  }
}
