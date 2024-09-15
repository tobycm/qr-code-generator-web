import { qrcode } from "@libs/qrcode";

const generateQrCodeButton = document.getElementById("generate-qr-code-button");
const downloadQrCodeButton = document.getElementById("download-qr-code-button");

let pngData: string | undefined = undefined;

downloadQrCodeButton?.addEventListener("click", async () => {
  const link = document.createElement("a");

  // console.log(pngData);

  link.href = pngData!;
  link.download = "qr-code.png";
  link.click();
});

generateQrCodeButton?.addEventListener("click", async () => {
  downloadQrCodeButton?.setAttribute("disabled", "true");

  const qrCodeData = (document.getElementById("data-input") as HTMLTextAreaElement).value;
  const qrCodeSvg = qrcode(qrCodeData, { output: "svg", ecl: "MEDIUM" });

  const qrCodeContainer = document.getElementById("qr-code") as HTMLDivElement;
  qrCodeContainer.innerHTML = qrCodeSvg;

  downloadQrCodeButton?.removeAttribute("hidden");

  pngData = await svgToPng(qrCodeSvg);
  downloadQrCodeButton?.removeAttribute("disabled");
});

async function svgToPng(svg: string): Promise<string> {
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
    image.src = `data:image/svg+xml;base64,${btoa(svg)}`;
  });
}
