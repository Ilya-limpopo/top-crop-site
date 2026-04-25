import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function slotToPublicId(slot: string): string {
  return `topcrop/${slot.replace(/\s+/g, '-').toLowerCase()}`;
}

export async function uploadImage(buffer: Buffer, slot: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: slotToPublicId(slot), overwrite: true, resource_type: 'image' },
      (err, result) => {
        if (err || !result) reject(err || new Error('Upload failed'));
        else resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}

export async function deleteImage(slot: string): Promise<void> {
  await cloudinary.uploader.destroy(slotToPublicId(slot));
}
