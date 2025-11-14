import cloudinary, { extractPublicId } from '@/libs/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ message: 'Missing or invalid image URLs array' }, { status: 400 });
    }
    const publicIds = urls.map(extractPublicId);
    const result = await cloudinary.api.delete_resources(publicIds);

    console.log("Cloudinary batch delete result:", result);

    return NextResponse.json({ message: 'Images deleted successfully', result }, { status: 200 });

  } catch (error) {
    console.error('Batch Delete API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}