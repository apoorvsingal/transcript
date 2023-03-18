
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = require('../../firebase.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "transcript-c78ca.appspot.com"
});

export async function storeAudio(content: Buffer){
  const name = new Date().getTime() + ".mp3";

  await getStorage().bucket().file(name).save(content);
  return name;
};

export async function fetchAudio(name: string) {
  return getStorage().bucket().file(name).download();
};