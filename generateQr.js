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
        