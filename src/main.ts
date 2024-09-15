import { options as QRCodeOptions, qrcode } from "@libs/qrcode";

const generateQrCodeButton = document.getElementById("generate-qr-code-button") as HTMLButtonElement;
const downloadQrCodeButton = document.getElementById("download-qr-code-button") as HTMLButtonElement;

const qrCodeDataInput = document.getElementById("data-input") as HTMLTextAreaElement;

const sizeInput = document.getElementById("size-input") as HTMLInputElement;
const colorInput = document.getElementById("color-input") as HTMLInputElement;
const backgroundColorInput = document.getElementById("background-color-input") as HTMLInputElement;
const eclInput = document.getElementById("ecl-input") as HTMLInputElement;

const qrCodeImage = document.getElementById("qr-code") as HTMLImageElement;

let pngData: string | undefined = undefined;

downloadQrCodeButton.addEventListener("click", async () => {
  const link = document.createElement("a");

  // console.log(pngData);

  link.href = pngData!;
  link.download = "qr-code.png";
  link.click();
});

generateQrCodeButton.addEventListener("click", async () => {
  downloadQrCodeButton.setAttribute("disabled", "true");

  const qrCodeData = qrCodeDataInput.value;

  const options: QRCodeOptions = {
    border: parseInt(sizeInput.value) || 4,
    dark: colorInput.value,
    light: backgroundColorInput.value,
    ecl: eclInput.value as QRCodeOptions["ecl"],
  };

  const qrCodeSvg = qrcode(qrCodeData, { ...options, output: "svg" });

  qrCodeImage.src = `data:image/svg+xml;base64,${btoa(qrCodeSvg)}`;

  document.getElementById("result")!.removeAttribute("hidden");

  pngData = await svgToPng(qrCodeImage.src);
  downloadQrCodeButton.removeAttribute("disabled");
});

async function svgToPng(svgData: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
      if (!image.width || !image.height) {
        image.width = 512;
        image.height = 512;
      }

      canvas.width = image.width;
      canvas.height = image.height;
      context?.drawImage(image, 0, 0, 512, 512);

      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = reject;
    image.src = svgData;
  });
}
