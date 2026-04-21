import { PDFDocument } from 'pdf-lib';
import toast from 'react-hot-toast';

export const mergePdf = async (files) => {
  const toastId = toast.loading(`Merging ${files.length} PDFs...`);
  try {
    const mergedPdf = await PDFDocument.create();

    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      const actualFile = (item instanceof File) ? item : item?.file;

      if (!actualFile) {
        console.error("Missing file object in item:", item);
        continue;
      }

      toast.loading(`Processing file ${i + 1} of ${files.length}...`, { id: toastId });
      
      const arrayBuffer = await actualFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    toast.loading("Finalizing generated document...", { id: toastId });
    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    toast.success("PDFs Merged Successfully!", { id: toastId });
    return {
      downloadUrl: URL.createObjectURL(blob),
      fileName: `merged_${Date.now()}.pdf`
    };
  } catch (error) {
    toast.error("Merge failed!", { id: toastId });
    console.error("Detailed Merge Error:", error);
    throw error;
  }
};