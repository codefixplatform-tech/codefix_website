import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun, PageBreak, HeadingLevel, ImageRun } from 'docx';
import toast from 'react-hot-toast';

// Vite-friendly worker loading
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

/**
 * Converts RGB array to Hex string
 */
const rgbToHex = (rgb) => {
  if (!rgb || rgb.length < 3) return "000000";
  return rgb.map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase().substring(0, 6);
};

/**
 * Extracts exact font size
 */
const getFontSize = (transform) => {
  return Math.sqrt(transform[0] * transform[0] + transform[1] * transform[1]);
};

/**
 * Advanced Style Detection
 */
const getStyles = (fontName) => {
  const name = (fontName || '').toLowerCase();
  return {
    bold: name.includes('bold') || name.includes('bd') || name.includes('heavy') || name.includes('black') || name.includes('semibold'),
    italics: name.includes('italic') || name.includes('it') || name.includes('oblique'),
  };
};

/**
 * Maps PDF X-coordinate to Word Indentation
 */
const getIndent = (x) => {
  return Math.max(0, Math.round(x * 12)); 
};

/**
 * Robust Utility: Converts PDF RGB data to PNG Base64
 */
const convertImageDataToPNG = (imgData) => {
  const canvas = document.createElement('canvas');
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  const ctx = canvas.getContext('2d');
  const imageDataArr = ctx.createImageData(imgData.width, imgData.height);
  
  const data = imgData.data;
  // Handle RGB (3 bytes) scale to RGBA (4 bytes)
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    imageDataArr.data[j] = data[i];
    imageDataArr.data[j+1] = data[i+1];
    imageDataArr.data[j+2] = data[i+2];
    imageDataArr.data[j+3] = 255;
  }
  ctx.putImageData(imageDataArr, 0, 0);
  return canvas.toDataURL('image/png');
};

export const convertPdfToWord = async (file) => {
  const toastId = toast.loading("Analyzing PDF structure...");
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const docChildren = [];

    toast.loading(`Processing ${pdf.numPages} pages & images...`, { id: toastId });

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        
        // 1. Better Image Extraction
        const ops = await page.getOperatorList();
        const images = [];
        
        for (let j = 0; j < ops.fnArray.length; j++) {
          const fn = ops.fnArray[j];
          if (fn === pdfjsLib.OPS.paintImageXObject || fn === pdfjsLib.OPS.paintInlineImageXObject) {
            const imgName = ops.argsArray[j][0];
            try {
              // Check local objects first, then common objects
              let img = page.objs.get(imgName);
              if (!img) img = page.commonObjs.get(imgName);
              
              if (img && img.data && img.width && img.height) {
                const base64 = convertImageDataToPNG(img);
                images.push({ data: base64, width: img.width, height: img.height });
              }
            } catch (e) { console.error("Image loading failed:", e); }
          }
        }

        // 2. Extract Text
        const textContent = await page.getTextContent();
        const items = textContent.items.sort((a, b) => {
          const yDiff = b.transform[5] - a.transform[5];
          if (Math.abs(yDiff) < 3) return a.transform[4] - b.transform[4];
          return yDiff;
        });

        let currentY = null;
        let currentLine = [];
        let minX = 0;

        // Add Images found on this page
        images.forEach(img => {
          docChildren.push(new Paragraph({
            children: [new ImageRun({
              data: img.data,
              transformation: { width: Math.min(img.width, 480), height: Math.min(img.height, 360) }
            })],
            alignment: "center",
            spacing: { before: 200, after: 200 }
          }));
        });

        for (const item of items) {
          const fontSize = getFontSize(item.transform);
          const styles = getStyles(item.fontName);
          const xPos = item.transform[4];
          const hexColor = rgbToHex(item.color || [0,0,0]);

          if (currentY !== null && Math.abs(item.transform[5] - currentY) > 5) {
            if (currentLine.length > 0) {
              let heading = undefined;
              if (fontSize > 17 && styles.bold) heading = HeadingLevel.HEADING_1;
              else if (fontSize > 12.5 && styles.bold) heading = HeadingLevel.HEADING_2;

              docChildren.push(new Paragraph({
                children: currentLine,
                heading: heading,
                indent: { left: getIndent(minX) },
                spacing: { after: 40, line: 240 },
              }));
            }
            currentLine = [];
            minX = xPos;
          }

          if (currentLine.length === 0) minX = xPos;

          currentLine.push(new TextRun({
            text: item.str + (item.hasEOL ? "" : " "),
            size: Math.round(fontSize * 2),
            bold: styles.bold,
            italics: styles.italics,
            color: hexColor,
            font: "Calibri",
          }));

          currentY = item.transform[5];
        }

        if (currentLine.length > 0) {
          docChildren.push(new Paragraph({ 
            children: currentLine,
            indent: { left: getIndent(minX) },
            spacing: { after: 40, line: 240 }
          }));
        }

        if (i < pdf.numPages) {
          docChildren.push(new Paragraph({ children: [new PageBreak()] }));
        }
    }

    toast.loading("Assembling Word document...", { id: toastId });

    const doc = new Document({
      sections: [{
        children: docChildren,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const downloadUrl = URL.createObjectURL(blob);
    const fileName = file.name.toLowerCase().replace('.pdf', '.docx');

    toast.success("Conversion Ready!", { id: toastId });
    return { downloadUrl, fileName };

  } catch (error) {
    toast.error("Conversion failed!", { id: toastId });
    console.error("Master Conversion Error:", error);
    throw error;
  }
};