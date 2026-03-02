import s3Client from '../awsConfig'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomBytes } from 'crypto'
import sharp from 'sharp'

function generateSaltedFilename(originalName: string, newExt?: string): string {
  const salt = randomBytes(16).toString('hex')
  const extension = newExt || originalName.split('.').pop()
  return `${salt}.${extension}`
}

async function compressImage(
  buffer: Buffer,
  mimetype: string,
): Promise<{ data: Buffer; ext: string; mime: string }> {
  const image = sharp(buffer)
  // แปลงเป็น WebP
  const compressed = await image.webp({ quality: 80 }).toBuffer()
  return { data: compressed, ext: 'webp', mime: 'image/webp' }
}

// เช็คว่าเป็นไฟล์รูปภาพหรือไม่
function isImage(mimetype: string): boolean {
  return mimetype.startsWith('image/')
}

export async function uploadFile(
  bucket: string,
  filePath: string,
  file: Express.Multer.File,
): Promise<{ ok: boolean; status: number; message: string; data?: any }> {
  let saltedFilename = file.originalname
  let saltedFilePath = `${filePath}/${saltedFilename}`
  let fileBuffer: Buffer
  let contentType: string
  if (isImage(file.mimetype)) {
    const compressed = await compressImage(file.buffer, file.mimetype)
    fileBuffer = compressed.data
    contentType = compressed.mime
    saltedFilename = generateSaltedFilename(file.originalname, compressed.ext)
    saltedFilePath = `${filePath}/${saltedFilename}`
  } else {
    return {
      ok: false as const,
      status: 500,
      message: 'File is not an image',
    }
  }
  const params = {
    Bucket: bucket,
    Key: saltedFilePath,
    Body: fileBuffer,
    ContentType: contentType,
  }

  try {
    const data = await s3Client.send(new PutObjectCommand(params))
    console.log('File uploaded successfully:', data)
    const presignedUrl = await getPresignedUrl(bucket, saltedFilePath, 3600)

    return {
      ok: true as const,
      status: 200,
      message: 'File uploaded successfully',
      data: {
        url: presignedUrl,
      },
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      ok: false as const,
      status: 500,
      message: 'Internal server error',
    }
  }
}

export async function getPresignedUrl(
  bucket: string,
  filePath: string,
  expiresIn: number = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: filePath,
  })
  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return url
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    throw error
  }
}
