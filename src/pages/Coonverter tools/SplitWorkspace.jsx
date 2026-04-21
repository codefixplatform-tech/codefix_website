import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FaTrash, FaDownload, FaThLarge } from 'react-icons/fa';

// Worker configuration for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const SplitWorkspace = ({ file, onProcess, isProcessing }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateThumbnails = async () => {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const thumbs = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        thumbs.push({ id: i - 1, url: canvas.toDataURL() });
      }
      setPages(thumbs);
      setLoading(false);
    };
    generateThumbnails();
  }, [file]);

  const removePage = (id) => {
    setPages(pages.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <FaThLarge className="text-primary text-2xl" /> Organize PDF
          </h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
            Remove pages you don't need
          </p>
        </div>
        <button 
          onClick={() => onProcess(pages.map(p => p.id))}
          disabled={pages.length === 0 || isProcessing}
          className="bg-primary hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black transition-all flex items-center gap-3 shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          <FaDownload /> {isProcessing ? "Processing..." : "Generate & Download"}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Generating Previews...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {pages.map((page, index) => (
            <div key={page.id} className="group relative bg-surface/50 border border-white/10 p-3 rounded-[1.5rem] hover:border-primary/50 transition-all hover:scale-[1.02]">
              <div className="absolute top-5 left-5 bg-black/70 backdrop-blur-md text-[10px] px-2.5 py-1 rounded-lg font-black z-10 text-white border border-white/10">
                PAGE {index + 1}
              </div>
              <button 
                onClick={() => removePage(page.id)}
                className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-20 shadow-xl"
              >
                <FaTrash className="text-xs" />
              </button>
              <img src={page.url} alt="PDF Page" className="w-full h-auto rounded-xl shadow-sm bg-white" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SplitWorkspace;