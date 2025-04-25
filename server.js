document.getElementById('uploadButton').addEventListener('click', async () => {
  const fileInput = document.getElementById('imageUpload');
  const output = document.getElementById('output');

  if (!fileInput.files[0]) {
    alert('Please select an image file first.');
    return;
  }

  const formData = new FormData();
  formData.append('image', fileInput.files[0]);

  try {
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    output.innerHTML = `
      <h3>Analysis:</h3>
      ${data.descriptiom}
      <h3>Routine:</h3>
      ${data.routine}
      <h3>Keywords:</h3>
      <ul>${data.keyword.map(word => `<li>${word}</li>`).join('')}</ul>
    `;
  } catch (err) {
    output.innerHTML = 'Error uploading image or processing data.';
    console.error(err);
  }
});
