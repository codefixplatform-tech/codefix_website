import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { FaTrash, FaDownload, FaThLarge, FaMagic } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Configure PDF.js worker locally to avoid CDN issues
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const SplitWorkspace = ({ file, onProcess, isProcessing }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateThumbnails = async () => {
      try {
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
      } catch (err) {
        console.error("PDF Thumbnail generation failed:", err);
      } finally {
        setLoading(false);
      }
    };
    generateThumbnails();
  }, [file]);

  const removePage = (id) => {
    setPages(pages.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      
      {/* --- PREMIUM CONTROL HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-8 bg-white/[0.02] border border-white/10 p-6 md:p-10 rounded-[3rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-1">
           <div className="w-32 h-32 -mr-16 -mt-16 bg-primary blur-[60px] opacity-10 rounded-full"></div>
        </div>

        <div className="text-center lg:text-left space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-2">
             <FaMagic className="text-primary text-[10px]" />
             <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Neural Workspace</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight flex items-center justify-center lg:justify-start gap-4">
            Organize <span className="text-primary italic">PDF</span>
          </h2>
          <p className="text-secondary/50 text-xs md:text-sm font-semibold uppercase tracking-[3px]">
             Remove pages & reconstruct document
          </p>
        </div>

        <button 
          onClick={() => onProcess(pages.map(p => p.id))}
          disabled={pages.length === 0 || isProcessing}
          className="w-full lg:w-auto bg-primary hover:bg-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-xl shadow-primary/20 disabled:opacity-50 hover:scale-[1.02] active:scale-95 group relative z-10"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <FaDownload className="group-hover:translate-y-1 transition-transform" /> 
              Generate & Download
            </>
          )}
        </button>
      </motion.div>

      {/* --- GRID SECTION --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-6">
          <div className="relative">
             <div className="w-16 h-16 border-2 border-primary/20 rounded-full animate-ping absolute inset-0"></div>
             <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin relative z-10"></div>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[4px] text-[10px] animate-pulse">Rendering Page Previews...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          <AnimatePresence>
            {pages.map((page, index) => (
              <motion.div 
                key={page.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                className="group relative bg-white/[0.03] border border-white/5 p-4 rounded-[2.5rem] hover:border-primary/40 transition-all shadow-xl backdrop-blur-sm"
              >
                {/* Page Badge */}
                <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md text-[9px] px-3 py-1.5 rounded-xl font-bold z-10 text-white border border-white/10 shadow-lg group-hover:bg-primary transition-colors">
                  PAGE {index + 1}
                </div>

                {/* Remove Button (Visible on mobile/Touch, Hover on Desktop) */}
                <button 
                  onClick={() => removePage(page.id)}
                  className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl lg:opacity-0 lg:group-hover:opacity-100 transition-all z-20 shadow-xl shadow-red-500/20 active:scale-90"
                >
                  <FaTrash className="text-[10px]" />
                </button>

                {/* Thumbnail */}
                <div className="relative rounded-[1.8rem] overflow-hidden bg-white shadow-inner aspect-[1/1.414] flex items-center justify-center">
                  <img src={page.url} alt={`Page ${index + 1}`} className="w-full h-full object-contain p-1" />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!loading && pages.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-40 bg-white/[0.01] border border-dashed border-white/10 rounded-[4rem]"
        >
           <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <FaThLarge className="text-3xl text-secondary/20" />
           </div>
           <h3 className="text-xl font-semibold text-white/40 mb-4 tracking-tight">Workspace is empty</h3>
           <p className="text-secondary/20 text-sm font-semibold uppercase tracking-widest">No pages left in the queue</p>
        </motion.div>
      )}
    </div>
  );
};

export default SplitWorkspace;