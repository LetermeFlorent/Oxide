/**
 * @file imageWorker.ts
 * @description Worker pour le décodage et le redimensionnement d'images via OffscreenCanvas.
 */

self.onmessage = async (e: MessageEvent) => {
  const { path, bytes, width = 64, height = 64 } = e.data;

  try {
    // 1. Créer un Blob à partir des octets
    const blob = new Blob([bytes]);
    
    // 2. Créer un ImageBitmap (décodage asynchrone hors thread principal)
    const bitmap = await createImageBitmap(blob);

    // 3. Utiliser OffscreenCanvas pour le redimensionnement
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error("Could not get canvas context");

    // Calculer le ratio pour un "center crop"
    const ratio = Math.max(width / bitmap.width, height / bitmap.height);
    const nw = bitmap.width * ratio;
    const nh = bitmap.height * ratio;
    const x = (width - nw) / 2;
    const y = (height - nh) / 2;

    ctx.drawImage(bitmap, x, y, nw, nh);
    
    // 4. Extraire le résultat sous forme de Blob ou ImageBitmap
    // On renvoie un ImageBitmap car c'est le plus performant pour le transfert "Zéro-Copie"
    const thumbnail = canvas.transferToImageBitmap();
    
    // Nettoyage du bitmap original
    bitmap.close();

    self.postMessage({ path, thumbnail }, [thumbnail] as any);
  } catch (error: any) {
    self.postMessage({ path, error: error.message });
  }
};
