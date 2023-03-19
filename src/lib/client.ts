export async function handleSave() {
  const buffer = await (await fetch("/testAudio.wav")).blob();

  const data  = new FormData();
  data.append('imageFile', buffer);

  const response = await fetch(`/api/handle`, {
    body: data,
    method: 'POST',
  });
  if (response.ok) {
    console.log("owkay");
  }
};

export async function getTransacipt(name: string) {
  const res = await fetch(`/api/getTranscript?name=${name}`);
  const data = await res.json();

  return data.transcript;
};
