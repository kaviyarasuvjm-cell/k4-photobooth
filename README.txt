K4 AI PHOTOBOOTH STUDIO — V1.0.0
================================

WHAT WORKS IN V1
- Responsive browser app for Windows laptop and Android browser
- Camera preview and photo capture (where browser permissions allow)
- Upload existing photos
- Event creation and assignment
- Local gallery stored in browser localStorage
- Download and print saved photos
- JSON backup export
- Basic offline app shell (after first secure load)

IMPORTANT LIMITATIONS
- This is a V1 local prototype, not yet a production deployment.
- Genuine AI portrait generation is NOT implemented yet. AI engine integration is V2.
- QR gallery, cloud sync, payments, customer booking and native APK are not implemented yet.
- Browser localStorage is not suitable for a large production photo library. IndexedDB/cloud storage migration is planned.
- Camera access normally requires HTTPS or localhost. Opening index.html directly may not enable the camera.
- Android PWA installation requires serving the app from HTTPS (or localhost on the same device).

RUN ON WINDOWS
1. Extract this ZIP to a folder, e.g. C:\K4-PhotoBooth
2. Install Python 3 if not already installed.
3. Open Command Prompt in that folder.
4. Run: python -m http.server 8000
5. On the same laptop open: http://localhost:8000
6. Press Start camera and allow camera permission.
7. Create an event, capture a photo, then Save to gallery.

RUN ON ANDROID FOR LOCAL TEST
For a quick test, use a secure HTTPS host for the extracted app files.
For local network testing, a plain HTTP LAN address may not grant camera permission on Android.
A later deployment step will configure HTTPS hosting and installable PWA.

TEST CHECKLIST
[ ] App opens on Windows
[ ] Camera permission granted and preview appears
[ ] Capture creates preview
[ ] Save to gallery persists after refresh
[ ] Event creation and photo assignment work
[ ] Download works
[ ] Print dialog opens
[ ] JSON backup downloads
[ ] Offline app shell opens after first successful load

PRIVACY
Photos are stored in the browser on the device. Export backups. Do not use shared/public devices for private event photos.
