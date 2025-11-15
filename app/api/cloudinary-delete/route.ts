import cloudinary, { extractPublicId } from '@/libs/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ message: 'Missing image URL' }, { status: 400 });
    }

    const publicId = extractPublicId(url);
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
        throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}