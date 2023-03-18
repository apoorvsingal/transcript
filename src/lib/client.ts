async function handleSave(image: Blob) {
  const file = new File([image], 'avatar.png', { type: 'image/png' })

  const data  = new FormData()
  data.append('imageFile', file);

  const response = await fetch(`/api/handle`, {
    body: data,
    method: 'POST',
  });

  if (response.ok) {
    console.log("owkay");
    
  }
};
