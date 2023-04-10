import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';

@Injectable()
export class FirebaseStorageProvider {
  constructor(@InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin) {
    // if (!getApps().length) {
    //   firebase.initializeApp({
    //     credential: firebase.credential.cert(firebase_params),
    //   });
    // }
  }

  public bucket = this.firebase.storage.bucket(
    `gs://${process.env.GCLOUD_STORAGE_BUCKET_URL}/`,
  );
  public uuid = uuidv4();

  public async uploadBlob(destFileName, contentType, buffer): Promise<any> {
    const newBuffer = await sharp(buffer)
      .resize(200, 200, { fit: 'inside' })
      .toBuffer();
    return new Promise((resolve, reject) => {
      const blob = this.bucket.file(destFileName);
      const blobWriter = blob.createWriteStream({
        resumable: false,
        public: true,
        metadata: {
          contentType,
          metadata: {
            firebaseStorageDownloadTokens: this.uuid,
          },
        },
      });

      blobWriter
        .on('error', () => {
          reject('Try again');
        })
        .on('finish', async () => {
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
            process.env.GCLOUD_STORAGE_BUCKET_URL
          }/o/${encodeURIComponent(blob.name)}?alt=media&token=${this.uuid}`;

          resolve(publicUrl);
        })
        .end(newBuffer);
    }).then((data) => {
      return data;
    });
  }
}
