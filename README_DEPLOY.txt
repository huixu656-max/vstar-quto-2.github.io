V-Star Auto Website Release Package

How to preview locally
1. Extract the ZIP file.
2. Double-click START_LOCAL_PREVIEW.bat.
3. Open http://127.0.0.1:8080/index.html in a browser.

How to upload to a server
1. Upload the extracted folder contents to your website root directory.
2. Make sure index.html is at the public root.
3. Keep the assets folder structure unchanged.

Important files
- index.html: homepage
- vehicles.html: vehicle listing page
- vehicle-detail.html: vehicle detail template
- about.html: company profile page
- news.html: news listing page
- admin.html: local editing backend
- assets/: images, CSS, JavaScript, and video assets

Notes
- This is a static website package. It does not require a database or backend server.
- The local admin page stores draft edits in the current browser. For official upload, use root image paths under assets/img and publish default content before packaging.
- If a browser opens local file:// pages slowly or behaves differently, use START_LOCAL_PREVIEW.bat for a more realistic preview.
