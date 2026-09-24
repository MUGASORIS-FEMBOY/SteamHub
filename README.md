# StreamHub

A GitHub Pages-ready personal streaming hub for Twitch, YouTube, TikTok and VR-M.net.

## What it does

- YouTube: converts normal video/shorts/live URLs to the YouTube embed player when possible.
- Twitch: converts a Twitch channel URL to the Twitch embed player and automatically uses the current GitHub Pages hostname as the required `parent` parameter.
- TikTok: converts supported TikTok video URLs to TikTok's official player.
- VR-M.net: provides a safe external-open fallback because third-party sites can prevent iframe embedding.
- Dark/neon UI with an optional light mode.
- No backend, database, API key, or server is required.

## Upload to GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md`.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and `/ (root)`.
6. Save and wait for GitHub Pages to publish.
7. Open the Pages URL GitHub gives you.

## Important limitations

This project does not bypass DRM, subscriptions, login requirements, geoblocking, copyright controls, or iframe restrictions.

A website can only embed another service when that service provides/permits an embeddable player. If a service blocks embedding, the app opens the content on the service instead.

For Twitch, the official player requires a `parent` parameter. The app uses `location.hostname`, so it should work on the final GitHub Pages domain without you manually editing the hostname.

## Customization

Edit the service cards and quick links in `app.js`. Change the visual theme in `style.css`.
