import { DeleteObjectCommand, PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUploadOptions } from './file-upload-options';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = configService.get('S3_ACCESS_KEY');
    const secretAccessKey = configService.get('S3_SECRET_KEY');
    const awsRegion = configService.get('AWS_REGION');
    const clientConfig: S3ClientConfig = {};
    if (accessKeyId && secretAccessKey) {
      clientConfig.region = awsRegion;
      clientConfig.credentials = {
        accessKeyId,
        secretAccessKey,
      };
      clientConfig.endpoint = this.configService.get('S3_ENDPOINT');
      this.s3Client = new S3Client(clientConfig);
    }
  }

  // upload files to S3 bucket
  async uploadFile({ bucket, key, file }: FileUploadOptions) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
      }),
    );
  }

  // Get a file from S3 bucket
  async getFileUrl(bucket: string, key: string): Promise<string> {
    const publicUrl = this.configService.get('S3_PUBLIC_URL');
    if (!publicUrl) {
      throw new Error('S3_PUBLIC_URL is not configured');
    }
    return `${publicUrl}/${bucket}/${key}`;
  }

  // Delete a file from S3 bucket
  async deleteFile(bucket:string,fileName: string) {
    return this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: fileName,
      }),
    );
  }
}
