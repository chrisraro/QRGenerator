const themeToggle = document.getElementById("theme-toggle");
const textInput = document.getElementById("text-input");
const generateButton = document.getElementById("generate-button");
const qrContainer = document.getElementById("qr-container");
const downloadButton = document.getElementById("download-btn");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
});

generateButton.addEventListener("click", () => {
    qrContainer.innerHTML = "";
    const qr = new QRCode(qrContainer, {
        text: textInput.value,
        width: 200,
        height: 200,
    });
    downloadButton.style.display = "block"; // Show the download button
});

downloadButton.addEventListener("click", function() {
    const canvas = qrContainer.querySelector("canvas");
    if (!canvas) {
        alert("QR code not generated yet!");
        return;
    }
    const imageData = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = imageData;
    downloadLink.download = "qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});