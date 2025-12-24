// src/service/upload.js
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "tu_preset_aqui"); // Configúralo en Cloudinary

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url; // Esta es la URL que guardaremos en la DB
  } catch (error) {
    console.error("Error subiendo a Cloudinary:", error);
    return null;
  }
};
