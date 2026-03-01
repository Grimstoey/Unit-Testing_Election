import {S3Client} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: "5176b2059a80d54e8cbf064b494b232b",
    secretAccessKey:
      "d9a0b8aa0f962fdb58448958539e781a1a0816a9046667ef3f5f88e9c5c2567a"
  },
  endpoint: "https://kymdpxdyiprmrdwkiied.storage.supabase.co/storage/v1/s3",
  region: "ap-southeast-1",
  forcePathStyle: true


});
export default s3Client;
