import axios from 'axios';

export async function getTransacipt(name: string) {
  const res = await axios.get(`/api/getTranscript?name=${name}`);
  return res.data.transcript;
}
