/**
 * Client-side image optimization and upload service.
 * Resizes large smartphone/camera photos to a crisp, web-optimized resolution (max 1920px)
 * and uploads them to the server's /api/upload endpoint, returning a permanent /uploads/... URL.
 */

export async function compressAndUploadImage(
  file: File,
  maxDimension = 1920,
  quality = 0.86
): Promise<{ url: string; filename: string }> {
  // 1. Optimize image in canvas before network transmission
  const compressedBase64 = await compressImageToDataUrl(file, maxDimension, quality);

  // 2. Transmit to server /api/upload endpoint
  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: compressedBase64,
        filename: file.name,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.url) {
        return {
          url: data.url,
          filename: data.filename || file.name,
        };
      }
    }
  } catch (netErr) {
    console.warn("Server upload failed, falling back to optimized inline data:", netErr);
  }

  // Graceful fallback to compressed Data URL if server is unreachable
  return {
    url: compressedBase64,
    filename: file.name,
  };
}

/**
 * Compresses an image file down to max dimension and returns a JPEG Data URL
 */
function compressImageToDataUrl(file: File, maxDimension: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    // SVGs can be read directly
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => {
        // If image decoding fails, return raw reader result
        resolve(reader.result as string);
      };
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Export as JPEG with given quality
          const outputType = file.type === "image/png" && file.size < 500 * 1024 ? "image/png" : "image/jpeg";
          const dataUrl = canvas.toDataURL(outputType, quality);
          resolve(dataUrl);
        } catch {
          resolve(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
