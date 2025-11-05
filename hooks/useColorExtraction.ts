'use client';

import { useState } from 'react';

export interface ExtractedColors {
  dominant: string;
  palette: string[];
}

export function useColorExtraction() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedColors, setExtractedColors] = useState<ExtractedColors | null>(null);

  const extractColors = async (imageFile: File): Promise<ExtractedColors> => {
    setIsExtracting(true);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }

            // Resize for performance
            const size = 100;
            canvas.width = size;
            canvas.height = size;
            ctx.drawImage(img, 0, 0, size, size);

            const imageData = ctx.getImageData(0, 0, size, size);
            const data = imageData.data;

            // Simple color extraction - get average color and sample colors
            let r = 0, g = 0, b = 0;
            const colorSamples: { [key: string]: number } = {};
            const step = 4 * 10; // Sample every 10 pixels

            for (let i = 0; i < data.length; i += step) {
              const red = data[i];
              const green = data[i + 1];
              const blue = data[i + 2];
              
              r += red;
              g += green;
              b += blue;

              // Quantize colors
              const quantR = Math.floor(red / 51) * 51;
              const quantG = Math.floor(green / 51) * 51;
              const quantB = Math.floor(blue / 51) * 51;
              const colorKey = `#${quantR.toString(16).padStart(2, '0')}${quantG.toString(16).padStart(2, '0')}${quantB.toString(16).padStart(2, '0')}`;
              colorSamples[colorKey] = (colorSamples[colorKey] || 0) + 1;
            }

            const pixelCount = data.length / (4 * 10);
            const avgR = Math.round(r / pixelCount);
            const avgG = Math.round(g / pixelCount);
            const avgB = Math.round(b / pixelCount);

            const dominant = `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;

            // Get top 5 colors
            const palette = Object.entries(colorSamples)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([color]) => color);

            const result = { dominant, palette };
            setExtractedColors(result);
            setIsExtracting(false);
            resolve(result);
          } catch (error) {
            setIsExtracting(false);
            reject(error);
          }
        };
        img.onerror = () => {
          setIsExtracting(false);
          reject(new Error('Failed to load image'));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        setIsExtracting(false);
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(imageFile);
    });
  };

  return {
    extractColors,
    isExtracting,
    extractedColors,
  };
}

