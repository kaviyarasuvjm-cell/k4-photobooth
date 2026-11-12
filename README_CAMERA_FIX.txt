K4 PHOTOBOOTH CAMERA FIX 1

Replace ONLY app.js and sw.js at the ROOT of the GitHub repository with the two files in this patch.

Why: app.js now explicitly waits for camera metadata, sets playsinline/muted, calls video.play(), and has a fallback camera constraint. sw.js uses a new cache version, removes old K4 caches, and fetches current app files from the network first.

After committing, wait for GitHub Pages deployment. In Chrome open the K4 site, open Site settings > Storage > Clear data (or Chrome Settings > Site settings > All sites > kaviyarasuvjm-cell.github.io > Clear & reset), then reopen the site and allow camera. Clearing site data may erase locally saved gallery photos and AI settings. Export/backup photos first if any exist.

Test Start camera. If preview appears, tap Capture, then Save original.
