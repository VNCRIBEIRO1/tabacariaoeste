import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(
  file: Buffer,
  folder: string = "tabacaria"
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"))
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            })
          }
        }
      )
      .end(file)
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export function getOptimizedUrl(
  url: string,
  options: { width?: number; height?: number; quality?: string } = {}
): string {
  const { width = 800, height = 800, quality = "auto" } = options
  if (!url.includes("cloudinary.com")) return url
  return url.replace("/upload/", `/upload/w_${width},h_${height},c_limit,q_${quality},f_auto/`)
}

export default cloudinary
