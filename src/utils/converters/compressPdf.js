import { PDFDocument } from 'pdf-lib';

export const compressPdf = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // 1. Original PDF load karein
    const originalPdf = await PDFDocument.load(arrayBuffer);
    
    // 2. Aik bilkul naya Blank PDF create karein
    const compressedPdf = await PDFDocument.create();
    
    // 3. Pages ko copy karein
    // Ye step puray PDF structure ko "re-index" karta hai, jis se size kam hota hai
    const pageIndices = originalPdf.getPageIndices();
    const copiedPages = await compressedPdf.copyPages(originalPdf, pageIndices);
    
    copiedPages.forEach((page) => {
      compressedPdf.addPage(page);
    });

    // 4. Metadata strip karna (Extra 1-2% yahan se nikalta hai)
    compressedPdf.setTitle("");
    compressedPdf.setAuthor("");
    compressedPdf.setCreator("");
    compressedPdf.setProducer("");

    // 5. Final Save with maximum internal compression
    // useObjectStreams: true sab se important hai browser-side compression ke liye
    const pdfBytes = await compressedPdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
      updateFieldAppearances: false,
    });

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Result return karein
    return {
      downloadUrl: URL.createObjectURL(blob),
      fileName: `optimized_${file.name}`,
      stats: {
        original: (file.size / 1024).toFixed(2) + " KB",
        compressed: (blob.size / 1024).toFixed(2) + " KB",
        ratio: Math.round((1 - blob.size / file.size) * 100) + "%"
      }
    };
  } catch (error) {
    console.error("Compression Error:", error);
    throw error;
  }
};