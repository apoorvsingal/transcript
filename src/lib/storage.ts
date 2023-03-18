
import { initializeApp, cert, getApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { createReadStream, read } from 'fs';

const serviceAccount = require('../../firebase.json');

try {
  getApp();
} catch {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "transcript-c78ca.appspot.com"
  });
}

export async function storeAudio(path: string){
  const name = new Date().getTime() + ".wav";

  const writable = getStorage().bucket().file(name).createWriteStream();
  const readable = createReadStream(path);

  readable.pipe(writable);

  await new Promise((resolve, reject) => {
    writable.on('finish', resolve);
    writable.on('error', reject);
  });
  return name;
};

export async function fetchAudio(name: string) {
  return getStorage().bucket().file(name).download();
};

export async function storeTranscript(name: string, transcript: string) {
  await getStorage().bucket().file(name + ".txt").save(transcript);
}

export async function fetchTranscript(name: string) {
  return getStorage().bucket().file(name + ".txt").download();
}
