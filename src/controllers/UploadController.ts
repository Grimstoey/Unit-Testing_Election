import { uploadFile } from '../services/UploadFileService'

export async function uploadController(req: any, res: any) {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).send('No file uploaded.')
    }

    const bucket = 'Election_App'
    const filePath = `uploads`

    const result = await uploadFile(bucket, filePath, file)

    if (!result.ok) {
      return res.status(result.status).send(result.message)
    }

    res.status(200).send(result.data)
  } catch (error) {
    res.status(500).send('Error uploading file.')
  }
}
