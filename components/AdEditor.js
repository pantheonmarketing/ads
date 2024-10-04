import React, { useState, useRef, useEffect } from 'react';

const AdEditor = ({ generatedAd, onDownload, onUpdate }) => {
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (generatedAd && generatedAd.imageUrl) {
      drawCanvas();
    }
  }, [generatedAd]);

  const applyTextCase = (text, textCase) => {
    switch (textCase) {
      case 'uppercase':
        return text.toUpperCase();
      case 'lowercase':
        return text.toLowerCase();
      case 'capitalize':
        return text.replace(/\b\w/g, char => char.toUpperCase());
      default:
        return text;
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const width = generatedAd.exportSize?.width || 1080;
    const height = generatedAd.exportSize?.height || 1080;

    canvas.width = width;
    canvas.height = height;

    // Draw white background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    const img = new Image();
    img.onload = () => {
      // Calculate image dimensions and position
      const imageSize = (generatedAd.imageSize || 100) * 0.75; // Default to 75% of the specified size
      const scale = imageSize / 100;

      let imgWidth = img.width * scale;
      let imgHeight = img.height * scale;

      // Maintain aspect ratio
      const aspectRatio = img.width / img.height;

      if (imgWidth > width) {
        imgWidth = width;
        imgHeight = imgWidth / aspectRatio;
      }
      if (imgHeight > height) {
        imgHeight = height;
        imgWidth = imgHeight * aspectRatio;
      }

      const imagePositionX = generatedAd.imagePositionX || 50;
      const imagePositionY = generatedAd.imagePositionY || 50;

      const imgX = (width - imgWidth) * (imagePositionX / 100);
      const imgY = (height - imgHeight) * (imagePositionY / 100);

      // Draw the image
      ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

      // Apply background overlay
      if (generatedAd.backgroundOverlay) {
        ctx.fillStyle = `rgba(0, 0, 0, ${generatedAd.backgroundOverlay / 100})`;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw texts
      drawText(ctx, generatedAd.topText, 'top', width, height, generatedAd);
      drawText(ctx, generatedAd.bottomText, 'bottom', width, height, generatedAd);

      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error('Error loading image:', generatedAd.imageUrl);
    };
    img.src = generatedAd.imageUrl;
  };

  const drawText = (ctx, text, position, width, height, adToUse) => {
    const fontName = adToUse[`${position}Font`] || 'Impact';
    const fontSize = adToUse[`${position}FontSize`] || 40;
    const textColor = adToUse[`${position}TextColor`] || '#000';
    const textAlignment = adToUse[`${position}TextAlignment`] || 'center';
    const padding = adToUse[`${position}Padding`] || 10;

    ctx.font = `${fontSize}px ${fontName}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = textAlignment;

    const textCase = adToUse[`${position}TextCase`] || 'uppercase';
    const processedText = applyTextCase(text || '', textCase);

    let x;
    if (textAlignment === 'left') {
      x = padding;
    } else if (textAlignment === 'right') {
      x = width - padding;
    } else {
      x = width / 2;
    }

    let y = position === 'top' ? padding + fontSize : height - padding;

    if (adToUse[`${position}TextOutline`]) {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.strokeText(processedText, x, y);
    }

    if (adToUse[`${position}AutoBreak`]) {
      const words = processedText.split(' ');
      let line = '';
      const lineHeight = fontSize * 1.2;
      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > width - padding * 2 && line !== '') {
          ctx.fillText(line, x, y);
          line = word + ' ';
          y += position === 'top' ? lineHeight : -lineHeight;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, x, y);
    } else {
      ctx.fillText(processedText, x, y);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onDownload(dataUrl);
    }
  };

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 'auto', display: imageLoaded ? 'block' : 'none' }}
      />
      {!imageLoaded && (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
          Loading image...
        </div>
      )}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={handleDownload}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Download Image
        </button>
      </div>
    </div>
  );
};

export default AdEditor;