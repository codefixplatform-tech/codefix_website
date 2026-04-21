import { jsPDF } from "jspdf";
import toast from 'react-hot-toast';

export const convertImageToPdf = async (file) => {
  const toastId = toast.loading("Preparing image...");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      
      img.onload = () => {
        toast.loading("Generating PDF...", { id: toastId });
        // PDF setup (A4 size)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Image dimensions calculation
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        
        // Centering image
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        pdf.addImage(img, 'JPEG', x, y, width, height);
        
        // Blob generate karna download ke liye
        const blob = pdf.output('blob');
        const downloadUrl = URL.createObjectURL(blob);
        const fileName = file.name.split('.')[0] + '.pdf';
        
        toast.success("PDF Ready!", { id: toastId });
        resolve({ downloadUrl, fileName });
      };
    };
    reader.onerror = (err) => {
      toast.error("Process failed!", { id: toastId });
      reject(err);
    };
  });
};