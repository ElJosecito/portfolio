const MAX_EDGE = 1600;
const QUALITY = 0.82;

/**
 * Lee las dimensiones reales de un archivo de imagen.
 *
 * Hacen falta guardadas en la base: el masonry necesita saber la proporción de
 * cada imagen para reservar su hueco antes de que cargue. Sin eso la galería se
 * reacomoda a saltos mientras bajan las fotos.
 */
export function readImageSize(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };

    image.src = url;
  });
}

/**
 * Redimensiona a un máximo de 1600px en el lado mayor y reencoda a WebP.
 *
 * Una captura de celular ronda los 3-5MB; veinte de esas por proyecto se comen
 * el gigabyte del plan gratuito en pocos proyectos. Bajarlas tal cual también
 * castiga a quien visite la galería desde el teléfono.
 *
 * Devuelve el archivo original si comprimir no achica nada — pasa con imágenes
 * ya optimizadas o muy chicas.
 */
export async function compressImage(file) {
  const { width, height } = await readImageSize(file);

  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  context.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close?.();

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY)
  );

  if (!blob || blob.size >= file.size) {
    return { file, width, height };
  }

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return {
    file: new File([blob], name, { type: "image/webp" }),
    width: targetWidth,
    height: targetHeight,
  };
}

export default compressImage;
