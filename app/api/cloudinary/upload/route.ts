import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const upload = () =>
      new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" }, // handles images + PDFs
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        stream.end(buffer);
      });

    const result = await upload();

    return NextResponse.json({ url: result.secure_url });
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
