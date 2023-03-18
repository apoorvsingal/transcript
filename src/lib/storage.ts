
import { initializeApp, cert, getApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = require('../../firebase.json');

try {
  getApp();
} catch {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "transcript-c78ca.appspot.com"
  });
}

export async function storeAudio(content: Buffer){
  const name = new Date().getTime() + ".wav";

  await getStorage().bucket().file(name).save(content);
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
