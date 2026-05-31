

const createImage = (url: string) : Promise<HTMLImageElement> => 
    new Promise ((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", reject);
        image.src = url;
    })


export const getCroppedImage = async (
    imageSrc : string,
    croppedAreaPixels : {
        x: number;
        y: number;
        width: number;
        height: number;
    }
)   => {
    const image = await createImage(imageSrc);
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");


    if (!ctx) {
    throw new Error("Canvas context not found");
  }

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to create blob"));
        return;
      }

      resolve(blob);
    }, "image/jpeg");
  });

} 
