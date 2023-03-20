export async function getTransacipt(name: string) {
  const res = await fetch(`/api/getTranscript?name=${name}`);
  const data = await res.json();

  return data.transcript;
};
