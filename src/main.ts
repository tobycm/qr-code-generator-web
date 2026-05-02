import "@fontsource/ubuntu/400.css";
import "@fontsource/ubuntu/500.css";
import "@fontsource/ubuntu/700.css";
import { options as QRCodeOptions, qrcode } from "@libs/qrcode";

const generateQrCodeButton = document.getElementById("generate-qr-code-button") as HTMLButtonElement;
const downloadQrCodeButton = document.getElementById("download-qr-code-button") as HTMLButtonElement;

function registerSaveToUrlParam(key: string, input: HTMLInputElement | HTMLTextAreaElement) {
  input.addEventListener("input", () => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(key, input.value);
    window.history.replaceState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
  });
}

const qrCodeDataInput = document.getElementById("data-input") as HTMLTextAreaElement;
registerSaveToUrlParam("data", qrCodeDataInput);

const sizeInput = document.getElementById("size-input") as HTMLInputElement;
registerSaveToUrlParam("size", sizeInput);
const colorInput = document.getElementById("color-input") as HTMLInputElement;
registerSaveToUrlParam("color", colorInput);

const backgroundColorInput = document.getElementById("background-color-input") as HTMLInputElement;
registerSaveToUrlParam("backgroundColor", backgroundColorInput);

const eclInput = document.getElementById("ecl-input") as HTMLInputElement;
registerSaveToUrlParam("ecl", eclInput);

const pngScaleInput = document.getElementById("png-download-scale") as HTMLSelectElement;

const qrCodeImage = document.getElementById("qr-code") as HTMLImageElement;

downloadQrCodeButton.addEventListener("click", async () => {
  const link = document.createElement("a");

  link.href = await downloadPng(qrCodeImage.src, { scale: parseInt(pngScaleInput.value) });
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

  downloadQrCodeButton.removeAttribute("disabled");
});

interface SvgToPngOptions {
  scale?: number;
}

async function downloadPng(svgData: string, { scale }: SvgToPngOptions = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width * (scale || 1);
      canvas.height = image.height * (scale || 1);
      context?.drawImage(image, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = reject;
    image.src = svgData;
  });
}

async function handleUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const data = urlParams.get("data");
  if (data) {
    qrCodeDataInput.value = data;
  }

  const size = urlParams.get("size");
  if (size) {
    sizeInput.value = size;
  }

  const color = urlParams.get("color");
  if (color) {
    colorInput.value = color;
  }

  const backgroundColor = urlParams.get("backgroundColor");
  if (backgroundColor) {
    backgroundColorInput.value = backgroundColor;
  }

  const ecl = urlParams.get("ecl");
  if (ecl) {
    eclInput.value = ecl;
  }

  if (data) {
    generateQrCodeButton.click();
  }
}

handleUrlParams();
