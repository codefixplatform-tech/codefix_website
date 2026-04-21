import { renderAsync } from 'docx-preview';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Converts a Word document (.docx) to PDF with high fidelity.
 * Focuses on preserving layout, font patterns, and optimizing size/quality.
 */
export const convertWordToPdf = async (file) => {
  let container = null;
  try {
    // 1. Prepare stage for rendering
    container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm'; // Standard A4 width
    container.style.backgroundColor = 'white';
    container.style.boxShadow = 'none';
    document.body.appendChild(container);

    const arrayBuffer = await file.arrayBuffer();
    
    // 2. Render Word to HTML via docx-preview
    // Using experimental features for better layout preservation
    await renderAsync(arrayBuffer, container, null, {
        inWrapper: false,
        ignoreWidth: false,
        ignoreHeight: false,
        useBase64URL: true,
        debug: false,
    });

    // Wait slightly for any internal assets/fonts to settle
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. Prepare PDF document (A4)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate page dimensions in pixels based on the 210mm width
    const containerWidthPx = container.offsetWidth;
    const pageHeightPx = Math.floor(containerWidthPx * (pdfHeight / pdfWidth));
    const totalHeightPx = container.scrollHeight;
    
    // 4. Multi-page capture logic (Initial Version)
    let currentHeight = 0;
    let pageCount = 0;

    while (currentHeight < totalHeightPx) {
        if (pageCount > 0) pdf.addPage();

        const canvas = await html2canvas(container, {
            scale: 2, 
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            y: currentHeight,
            height: Math.min(pageHeightPx, totalHeightPx - currentHeight),
            width: containerWidthPx,
            windowWidth: containerWidthPx,
            scrollX: 0,
            scrollY: -currentHeight
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        const finalImgHeightMm = (canvas.height / 2) * (pdfWidth / (canvas.width / 2));

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, finalImgHeightMm, undefined, 'FAST');

        currentHeight += pageHeightPx;
        pageCount++;
        
        canvas.width = 0;
        canvas.height = 0;
    }

    // 5. Finalize and Return
    const pdfBlob = pdf.output('blob');
    
    if (container && container.parentNode) {
        document.body.removeChild(container);
    }

    return {
        downloadUrl: URL.createObjectURL(pdfBlob),
        fileName: file.name.replace(/\.[^/.]+$/, "") + ".pdf",
        size: (pdfBlob.size / 1024).toFixed(2) + " KB"
    };

  } catch (error) {
    if (container && container.parentNode) {
        document.body.removeChild(container);
    }
    console.error("Word to PDF Conversion Failed:", error);
    throw error;
  }
};