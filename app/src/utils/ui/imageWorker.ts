/**
 * @file imageWorker.ts
 * @description Worker for image decoding and resizing using OffscreenCanvas.
 */

export {};

self.onmessage = async (e: MessageEvent) => {
  const { path, bytes, width = 64, height = 64 } = e.data;

  try {
    const blob = new Blob([bytes]);
    const bitmap = await createImageBitmap(blob);
    
    // Safety check for OffscreenCanvas support (WebKit on Linux might lack it)
    if (typeof OffscreenCanvas === 'undefined') {
      self.postMessage({ path, thumbnail: bitmap }, [bitmap] as any);
      return;
    }

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error("Could not get canvas context");

    const ratio = Math.max(width / bitmap.width, height / bitmap.height);
    const nw = bitmap.width * ratio;
    const nh = bitmap.height * ratio;
    const x = (width - nw) / 2;
    const y = (height - nh) / 2;

    ctx.drawImage(bitmap, x, y, nw, nh);
    const thumbnail = canvas.transferToImageBitmap();
    bitmap.close();

    self.postMessage({ path, thumbnail }, [thumbnail] as any);
  } catch (error: any) {
    self.postMessage({ path, error: error.message });
  }
};
