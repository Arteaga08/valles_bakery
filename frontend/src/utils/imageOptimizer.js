export const optimizeImage = (url, width = 800) => {
  if (!url) return "";

  // 1. Optimización para Cloudinary
  if (url.includes("res.cloudinary.com")) {
    // f_auto: formato automático (webp/avif)
    // q_auto: compresión automática
    // w_X: ancho específico
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }

  // 2. Optimización para Unsplash
  if (url.includes("images.unsplash.com")) {
    const baseUrl = url.split("?")[0]; // Quitamos parámetros viejos
    return `${baseUrl}?auto=format&fit=crop&q=75&w=${width}&fm=webp`;
  }

  // 3. Si es una imagen local o de otro origen, la devolvemos tal cual
  return url;
};
