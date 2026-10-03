# ID Card Capture Interface

A React + TypeScript demo app for capturing ID card photos via webcam. Users capture the front of their ID, the back, and a selfie holding the ID, then review and submit. All captures are stored locally in the browser using localStorage — no backend or database required.

## Features

- Webcam-based photo capture with front/back camera switching
- Three-step guided flow: front of ID, back of ID, selfie with ID
- Review screen to retake any photo before submitting
- Captures saved to localStorage with a generated reference ID
- Fully responsive design

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- react-webcam
- lucide-react icons

## Getting Started

```bash
npm install
npm run dev
```

The app requires camera access. Use a browser that supports `getUserMedia` and serve over HTTPS or localhost.
