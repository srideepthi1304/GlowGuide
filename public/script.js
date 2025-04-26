document.getElementById("uploadButton").addEventListener("click", async () => {
    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];
    
    if (!file) {
      alert("Please select an image first!");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", file);
    console.log(formData)
  
    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      document.getElementById("output").textContent = result.text;
      console.log("ganja:",result)
    } catch (error) {
      console.error("Error uploading image:", error);
      document.getElementById("output").textContent = `Error uploading image: ${error.message}`;
    }
  });
