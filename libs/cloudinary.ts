import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const extractPublicId = (url: string): string => {
  // Split the URL string at the "/upload/" delimiter.
  // We only care about the second part (the image path).
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    throw new Error('Invalid Cloudinary URL structure');
  }
  const pathWithVersion = url.substring(uploadIndex + 8); // +8 to skip "/upload/"

  // Remove the version number (the "v123456789/") from the start of the path.
  // The version part starts with 'v' followed by numbers and a slash.
  const versionMatch = pathWithVersion.match(/^v\d+\//);

  let publicId = pathWithVersion;
  if (versionMatch) {
    publicId = pathWithVersion.substring(versionMatch[0].length);
  }
  
  // Remove the file extension (.jpg, .png, etc.)
  const extensionIndex = publicId.lastIndexOf('.');
  if (extensionIndex !== -1) {
    publicId = publicId.substring(0, extensionIndex);
  }

  return publicId;
};

export default cloudinary;