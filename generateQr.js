const themeToggle = document.getElementById("theme-toggle");
        const textInput = document.getElementById("text-input");
        const generateButton = document.getElementById("generate-button");
        const qrContainer = document.getElementById("qr-container");

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
        });
        document.getElementById("download-btn").addEventListener("click", function() {
            // Locate the canvas element that contains the QR code.
            // This assumes that your QR generator library renders a <canvas> inside #qrcode.
            const qrContainer = document.getElementById("qr-container");
            const canvas = qrContainer.querySelector("canvas");
          
            if (!canvas) {
              alert("QR code not generated yet!");
              return;
            }
          
            // Convert the canvas content to a data URL in PNG format.
            const imageData = canvas.toDataURL("image/png");
          
            // Create a temporary link element
            const downloadLink = document.createElement("a");
            downloadLink.href = imageData;
            downloadLink.download = "qr-code.png";
          
            // Append the link to the document, trigger a click, and then remove it.
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          });
          