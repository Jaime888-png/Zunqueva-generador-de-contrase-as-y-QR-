/* =========================
   PASSWORD GENERATOR
========================= */

const passwordOutput = document.getElementById("passwordOutput");
const passwordLength = document.getElementById("passwordLength");
const lengthValue = document.getElementById("lengthValue");
const includeNumbers = document.getElementById("includeNumbers");
const includeSymbols = document.getElementById("includeSymbols");
const generatePasswordButton = document.getElementById("generatePassword");
const copyPasswordButton = document.getElementById("copyPassword");


const letters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const numbers =
  "0123456789";

const symbols =
  "!@#$%^&*()_+-=[]{}|;:,.<>?";


/*
  Generates a cryptographically stronger random
  character using the browser's Web Crypto API.
*/
function secureRandomIndex(max) {
  const array = new Uint32Array(1);

  window.crypto.getRandomValues(array);

  return array[0] % max;
}


function generatePassword() {

  const length = Number(passwordLength.value);

  let characters = letters;

  if (includeNumbers.checked) {
    characters += numbers;
  }

  if (includeSymbols.checked) {
    characters += symbols;
  }


  let password = "";


  for (let i = 0; i < length; i++) {

    const randomIndex =
      secureRandomIndex(characters.length);

    password += characters[randomIndex];
  }


  passwordOutput.value = password;
}


passwordLength.addEventListener("input", () => {

  lengthValue.textContent = passwordLength.value;

});


generatePasswordButton.addEventListener(
  "click",
  generatePassword
);


copyPasswordButton.addEventListener(
  "click",
  async () => {

    if (!passwordOutput.value) {
      return;
    }

    try {

      await navigator.clipboard.writeText(
        passwordOutput.value
      );

      copyPasswordButton.textContent = "Copied!";

      setTimeout(() => {
        copyPasswordButton.textContent = "Copy";
      }, 1200);

    } catch (error) {

      passwordOutput.select();

      document.execCommand("copy");

      copyPasswordButton.textContent = "Copied!";

      setTimeout(() => {
        copyPasswordButton.textContent = "Copy";
      }, 1200);

    }

  }
);


/* Generate a password immediately when the page loads. */

generatePassword();


/* =========================
   QR CODE GENERATOR
========================= */

const qrInput = document.getElementById("qrInput");
const generateQRButton = document.getElementById("generateQR");
const qrResult = document.getElementById("qrResult");
const downloadQRButton = document.getElementById("downloadQR");


let currentQRCode = null;


generateQRButton.addEventListener(
  "click",
  generateQRCode
);


function generateQRCode() {

  const text = qrInput.value.trim();


  if (!text) {

    qrResult.innerHTML = "";

    downloadQRButton.classList.add("hidden");

    return;
  }


  qrResult.innerHTML = "";


  /*
    QRCode comes from qrcodejs, loaded in index.html.
  */

  currentQRCode = new QRCode(qrResult, {

    text: text,

    width: 220,
    height: 220,

    correctLevel: QRCode.CorrectLevel.H

  });


  downloadQRButton.classList.remove("hidden");
}


/* =========================
   DOWNLOAD QR CODE
========================= */

downloadQRButton.addEventListener(
  "click",
  () => {

    const canvas =
      qrResult.querySelector("canvas");

    const image =
      qrResult.querySelector("img");


    let downloadURL = null;


    if (canvas) {

      downloadURL =
        canvas.toDataURL("image/png");

    } else if (image) {

      downloadURL =
        image.src;
    }


    if (!downloadURL) {
      return;
    }


    const link =
      document.createElement("a");


    link.href = downloadURL;

    link.download =
      "zunqueva-qr-code.png";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  }
);