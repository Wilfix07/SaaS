# PWA Icons Setup Guide

This directory should contain the following icon sizes for PWA support:

## Required Icons

- `icon-72x72.png` - 72x72 pixels
- `icon-96x96.png` - 96x96 pixels
- `icon-128x128.png` - 128x128 pixels
- `icon-144x144.png` - 144x144 pixels
- `icon-152x152.png` - 152x152 pixels
- `icon-192x192.png` - 192x192 pixels
- `icon-384x384.png` - 384x384 pixels
- `icon-512x512.png` - 512x512 pixels

## Icon Design Guidelines

- Use a simple, recognizable logo or icon
- Ensure good contrast and visibility
- Icons should be square with padding
- Use maskable icons for better Android support

## Generating Icons

You can use online tools like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
- https://favicon.io/

Or create them programmatically using tools like:
- ImageMagick
- Sharp (Node.js)
- Canvas API

## Quick Setup

For now, you can create a simple placeholder icon using any image editor:
1. Create a 512x512px image with your logo/icon
2. Resize it to all required sizes
3. Save them in the `/public/icons/` directory

## Note

Currently, the app will work without these icons, but they are recommended for:
- Better PWA install experience
- Home screen icons on mobile devices
- Splash screens on iOS
- Better app store presence

