import { PDFDocument } from 'pdf-lib';
import toast from 'react-hot-toast';

export const splitPdf = async (file, selectedPages) => {
  const toastId = toast.loading("Organizing PDF pages...");
  try {
    const arrayBuffer = await file.arrayBuffer();
    const mainPdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();

    toast.loading(`Extracting ${selectedPages.length} selected pages...`, { id: toastId });
    
    // selectedPages is an array of indices, e.g., [0, 2, 5]
    const copiedPages = await newPdf.copyPages(mainPdf, selectedPages);
    copiedPages.forEach((page) => newPdf.addPage(page));

    toast.loading("Generating your new PDF...", { id: toastId });
    const pdfBytes = await newPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    toast.success("PDF Ready!", { id: toastId });
    return {
      downloadUrl: URL.createObjectURL(blob),
      fileName: `organized_${file.name}`,
    };
  } catch (error) {
    toast.error("Process failed!", { id: toastId });
    console.error("Split Error:", error);
    throw error;
  }
};