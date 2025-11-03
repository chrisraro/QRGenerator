# Advanced QR Code Generator

A feature-rich QR code generator with customization options, multiple input types, and scanning capabilities.

## Features

- Generate QR codes for different content types:
  - Text/URL
  - Contact information (vCard)
  - WiFi credentials
  - Email addresses
  - SMS messages
  - Phone numbers
- Customize QR code appearance:
  - Size adjustment
  - Foreground and background colors
  - Add logos to QR codes
- Download in multiple formats:
  - PNG
  - JPG
  - SVG
- Built-in QR code scanner
- Dark/Light theme toggle
- Responsive design

## Usage

1. Open `index.html` in your browser
2. Select the type of QR code you want to generate
3. Enter the required information
4. Customize appearance if desired
5. Click "Generate QR Code"
6. Download the QR code in your preferred format

## Deployment to GitHub Pages

1. Fork this repository or create your own
2. Push the code to the `main` branch (or set the default branch)
3. Go to repository Settings → Pages
4. Select "Deploy from a branch"
5. Choose "main" branch and "/" folder
6. Click "Save"
7. Your site will be available at `https://<username>.github.io/<repository-name>`

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- [qrcode.js](https://github.com/davidshimjs/qrcodejs) - QR code generation
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) - QR code scanning

## Browser Compatibility

The application works on all modern browsers that support:
- HTML5 Canvas
- File API
- MediaDevices API (for QR scanning)

## License

MIT License