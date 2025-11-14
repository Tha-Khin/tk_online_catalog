import { NextResponse } from 'next/server';
import cloudinary from '@/libs/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file found.' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    // We must use upload_stream and a Promise to handle the buffer
    const secure_url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'tk-online-catalog' }, // Optional: specify a folder
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result) {
            return resolve(result.secure_url);
          }
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ success: true, url: secure_url });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ message: 'Upload failed.' }, { status: 500 });
  }
}