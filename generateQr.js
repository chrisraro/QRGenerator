// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const textInput = document.getElementById("text-input");
const generateButton = document.getElementById("generate-button");
const qrContainer = document.getElementById("qr-container");
const downloadButton = document.getElementById("download-btn");
const downloadFormat = document.getElementById("download-format");
const qrSizeSlider = document.getElementById("qr-size");
const qrSizeValue = document.getElementById("qr-size-value");
const fgColorPicker = document.getElementById("fg-color");
const bgColorPicker = document.getElementById("bg-color");
const logoUpload = document.getElementById("logo-upload");
const inputType = document.getElementById("input-type");
const contactFields = document.getElementById("contact-fields");
const wifiFields = document.getElementById("wifi-fields");
const contactName = document.getElementById("contact-name");
const contactPhone = document.getElementById("contact-phone");
const contactEmail = document.getElementById("contact-email");
const contactOrg = document.getElementById("contact-org");
const wifiSsid = document.getElementById("wifi-ssid");
const wifiPassword = document.getElementById("wifi-password");
const wifiSecurity = document.getElementById("wifi-security");
const scannerButton = document.getElementById("scanner-button");

// Current QR code instance
let currentQR = null;

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
});

// Update QR size value display
qrSizeSlider.addEventListener("input", () => {
    qrSizeValue.textContent = `${qrSizeSlider.value}px`;
});

// Handle input type changes
inputType.addEventListener("change", function() {
    // Hide all conditional fields
    contactFields.style.display = "none";
    wifiFields.style.display = "none";
    
    // Show relevant fields based on selection
    if (this.value === "contact") {
        contactFields.style.display = "block";
    } else if (this.value === "wifi") {
        wifiFields.style.display = "block";
    }
});

// Generate QR Code
generateButton.addEventListener("click", () => {
    // Clear previous QR code
    qrContainer.innerHTML = "";
    
    // Get the text to encode
    let textToEncode = "";
    let isValid = true;
    let errorMessage = "";
    
    switch(inputType.value) {
        case "text":
            textToEncode = textInput.value;
            if (!textToEncode.trim()) {
                isValid = false;
                errorMessage = "Please enter some text or URL!";
            }
            break;
        case "contact":
            if (!contactName.value.trim()) {
                isValid = false;
                errorMessage = "Contact name is required!";
            } else {
                textToEncode = generateVCard(
                    contactName.value,
                    contactPhone.value,
                    contactEmail.value,
                    contactOrg.value
                );
            }
            break;
        case "wifi":
            if (!wifiSsid.value.trim()) {
                isValid = false;
                errorMessage = "WiFi network name (SSID) is required!";
            } else {
                textToEncode = generateWifiString(
                    wifiSsid.value,
                    wifiSecurity.value,
                    wifiPassword.value
                );
            }
            break;
        case "email":
            textToEncode = textInput.value;
            if (!textToEncode.trim()) {
                isValid = false;
                errorMessage = "Please enter an email address!";
            } else if (!isValidEmail(textToEncode)) {
                isValid = false;
                errorMessage = "Please enter a valid email address!";
            } else {
                textToEncode = `mailto:${textToEncode}`;
            }
            break;
        case "sms":
            textToEncode = textInput.value;
            if (!textToEncode.trim()) {
                isValid = false;
                errorMessage = "Please enter a phone number for SMS!";
            } else if (!isValidPhoneNumber(textToEncode)) {
                isValid = false;
                errorMessage = "Please enter a valid phone number!";
            } else {
                textToEncode = `sms:${textToEncode}`;
            }
            break;
        case "phone":
            textToEncode = textInput.value;
            if (!textToEncode.trim()) {
                isValid = false;
                errorMessage = "Please enter a phone number!";
            } else if (!isValidPhoneNumber(textToEncode)) {
                isValid = false;
                errorMessage = "Please enter a valid phone number!";
            } else {
                textToEncode = `tel:${textToEncode}`;
            }
            break;
        default:
            textToEncode = textInput.value;
            if (!textToEncode.trim()) {
                isValid = false;
                errorMessage = "Please enter some text!";
            }
    }
    
    // Validate input
    if (!isValid) {
        alert(errorMessage);
        return;
    }
    
    // Validate size
    const size = parseInt(qrSizeSlider.value);
    if (size < 100 || size > 500) {
        alert("QR code size must be between 100px and 500px");
        return;
    }
    
    try {
        // Create new QR code
        const fgColor = fgColorPicker.value;
        const bgColor = bgColorPicker.value;
        
        // Create new QR code
        currentQR = new QRCode(qrContainer, {
            text: textToEncode,
            width: size,
            height: size,
            colorDark: fgColor,
            colorLight: bgColor,
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // After QR code is generated, add logo if selected
        const logoFile = logoUpload.files[0];
        if (logoFile) {
            // Wait for QR code to be fully rendered before adding logo
            setTimeout(() => {
                addLogoToQRCode(logoFile, size);
            }, 100);
        }
        
        // Show download button and format selector
        downloadButton.style.display = "block";
        downloadFormat.style.display = "inline-block";
        
        // Show success message (optional)
        console.log("QR code generated successfully!");
    } catch (error) {
        console.error("Error generating QR code:", error);
        alert("Error generating QR code. Please check your input and try again.");
    }
});
});

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number format (basic validation)
function isValidPhoneNumber(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    // Remove common separators and check if remaining characters are numbers
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
}

// Add logo to QR code
function addLogoToQRCode(logoFile, qrSize) {
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const logoImg = new Image();
        logoImg.onload = function() {
            // Get the QR code image element that was generated
            const qrImg = qrContainer.querySelector("img");
            if (!qrImg) return;
            
            // Create a canvas to combine QR code and logo
            const canvas = document.createElement("canvas");
            canvas.width = qrSize;
            canvas.height = qrSize;
            const ctx = canvas.getContext("2d");
            
            // Create a new image to load the QR code
            const qrCodeImg = new Image();
            qrCodeImg.onload = function() {
                // Draw the QR code onto the canvas
                ctx.drawImage(qrCodeImg, 0, 0, qrSize, qrSize);
                
                // Calculate logo size (typically 15-20% of QR code size)
                const logoSize = Math.min(qrSize * 0.2, Math.min(logoImg.width, logoImg.height));
                
                // Calculate position (centered)
                const x = (qrSize - logoSize) / 2;
                const y = (qrSize - logoSize) / 2;
                
                // Draw a white background for the logo (optional)
                ctx.fillStyle = bgColorPicker.value; // Use the QR code background color
                const padding = 5;
                ctx.fillRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2);
                
                // Draw the logo image
                ctx.drawImage(logoImg, x, y, logoSize, logoSize);
                
                // Replace the QR code image with the canvas
                // Store the original image for potential re-generation
                if (qrImg.parentNode) {
                    qrImg.parentNode.replaceChild(canvas, qrImg);
                }
            };
            qrCodeImg.src = qrImg.src;
        };
        logoImg.src = event.target.result;
    };
    
    reader.readAsDataURL(logoFile);
}

// Generate vCard format for contact QR code
function generateVCard(name, phone, email, org) {
    let vCard = "BEGIN:VCARD\nVERSION:3.0\n";
    
    if (name) vCard += `FN:${name}\n`;
    if (phone) vCard += `TEL:${phone}\n`;
    if (email) vCard += `EMAIL:${email}\n`;
    if (org) vCard += `ORG:${org}\n`;
    
    vCard += "END:VCARD";
    
    return vCard;
}

// Generate WiFi connection string
function generateWifiString(ssid, security, password) {
    // Escape special characters in SSID and password
    const escapedSsid = ssid.replace(/[\:;"\\]/g, "\\$&");
    const escapedPassword = password.replace(/[\:;"\\]/g, "\\$&");
    
    return `WIFI:T:${security};S:${escapedSsid};P:${escapedPassword};;`;
}

// Download QR Code
downloadButton.addEventListener("click", function() {
    let canvas = qrContainer.querySelector("canvas");
    if (!canvas) {
        // If no canvas, try to find the image and convert it to canvas
        const img = qrContainer.querySelector("img");
        if (!img) {
            alert("QR code not generated yet!");
            return;
        }
        
        // If there's an image but no canvas, create canvas from image
        canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
    }
    
    const format = downloadFormat.value;
    
    if (format === "svg") {
        // For SVG format, we need to create an SVG representation
        createSvgDownload();
    } else {
        // For PNG and JPG formats
        let mimeType, extension;
        
        switch(format) {
            case "png":
                mimeType = "image/png";
                extension = "png";
                break;
            case "jpg":
                mimeType = "image/jpeg";
                extension = "jpg";
                break;
            default:
                mimeType = "image/png";
                extension = "png";
        }
        
        const imageData = canvas.toDataURL(mimeType);
        const downloadLink = document.createElement("a");
        downloadLink.href = imageData;
        downloadLink.download = `qr-code.${extension}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
});

// Create SVG download
function createSvgDownload() {
    // Get the text content to encode
    let textToEncode = "";
    
    switch(inputType.value) {
        case "text":
            textToEncode = textInput.value;
            break;
        case "contact":
            textToEncode = generateVCard(
                contactName.value,
                contactPhone.value,
                contactEmail.value,
                contactOrg.value
            );
            break;
        case "wifi":
            textToEncode = generateWifiString(
                wifiSsid.value,
                wifiSecurity.value,
                wifiPassword.value
            );
            break;
        case "email":
            textToEncode = `mailto:${textInput.value}`;
            break;
        case "sms":
            textToEncode = `sms:${textInput.value}`;
            break;
        case "phone":
            textToEncode = `tel:${textInput.value}`;
            break;
        default:
            textToEncode = textInput.value;
    }
    
    // Create SVG content
    const size = parseInt(qrSizeSlider.value);
    const fgColor = fgColorPicker.value;
    const bgColor = bgColorPicker.value;
    
    // Note: Actually generating SVG QR codes requires a more complex implementation
    // For now, we'll create a placeholder SVG with basic information
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial" font-size="12" fill="${fgColor}" text-anchor="middle" dominant-baseline="middle">
            QR Code: ${textToEncode.substring(0, 30)}${textToEncode.length > 30 ? '...' : ''}
        </text>
    </svg>`;
    
    // Create download link for SVG
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = 'qr-code.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
}

// Toggle scanner visibility
scannerButton.addEventListener("click", function() {
    const qrReader = document.getElementById("qr-reader");
    if (qrReader.style.display === "none") {
        qrReader.style.display = "block";
        this.textContent = "Hide Scanner";
        initScanner();
    } else {
        qrReader.style.display = "none";
        this.textContent = "Scan QR Code";
    }
});

// Initialize QR code scanner
function initScanner() {
    // Check if scanner is already initialized
    const existingScanner = document.getElementById("qr-reader-element");
    if (existingScanner) return;
    
    // Create scanner container
    const scannerDiv = document.createElement("div");
    scannerDiv.id = "qr-reader-element";
    document.getElementById("qr-reader").appendChild(scannerDiv);
    
    // Initialize the scanner
    const html5QrCode = new Html5Qrcode("qr-reader-element");
    const config = { fps: 10, qrbox: 250 };
    
    html5QrCode.start({ facingMode: "environment" }, config, (decodedText, decodedResult) => {
        // Display decoded text
        document.getElementById("qr-reader-results").innerHTML = `
            <p><strong>Decoded QR Code:</strong></p>
            <p>${decodedText}</p>
        `;
        
        // Stop scanning after first successful read
        html5QrCode.stop().catch(err => console.log("Error stopping scanner: ", err));
    }, (errorMessage) => {
        // Handle scanning errors (not an issue, just no QR code found)
    }).catch(err => {
        console.error("Error starting scanner: ", err);
        document.getElementById("qr-reader-results").innerHTML = `<p>Error: ${err.message}</p>`;
    });
}