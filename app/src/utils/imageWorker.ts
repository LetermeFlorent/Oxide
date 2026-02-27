/**
 * @file imageWorker.ts
 * @description Worker for image decoding and resizing using OffscreenCanvas.
 */

self.onmessage = async (e: MessageEvent) => {
  const { path, bytes, width = 64, height = 64 } = e.data;

  try {
    // 1. Create a Blob from the byte array
    const blob = new Blob([bytes]);
    
    // 2. Create an ImageBitmap (asynchronous decoding off the main thread)
    const bitmap = await createImageBitmap(blob);

    // 3. Use OffscreenCanvas for resizing
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error("Could not get canvas context");

    // Calculate ratio for a "center crop"
    const ratio = Math.max(width / bitmap.width, height / bitmap.height);
    const nw = bitmap.width * ratio;
    const nh = bitmap.height * ratio;
    const x = (width - nw) / 2;
    const y = (height - nh) / 2;

    ctx.drawImage(bitmap, x, y, nw, nh);
    
    // 4. Extract the result as an ImageBitmap
    // Returning an ImageBitmap is most efficient for "Zero-Copy" transfer
    const thumbnail = canvas.transferToImageBitmap();
    
    // Clean up original bitmap
    bitmap.close();

    self.postMessage({ path, thumbnail }, [thumbnail] as any);
  } catch (error: any) {
    self.postMessage({ path, error: error.message });
  }
};
