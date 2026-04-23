import React from 'react';
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { FaPlus, FaTrash, FaFilePdf, FaArrowRight, FaGripVertical } from "react-icons/fa6";
import { FaMagic } from "react-icons/fa";
const MergeWorkspace = ({ files, setFiles, onMerge, isProcessing }) => {
  
  const handleAddMore = (e) => {
    const newFiles = Array.from(e.target.files);
    // Add unique IDs to new files for stable reordering
    const processedFiles = newFiles.map(f => {
      f.id = Math.random().toString(36).substr(2, 9);
      return f;
    });
    setFiles((prev) => [...prev, ...processedFiles]);
  };

  const removeFile = (id) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6">
      
      {/* --- PREMIUM CONTROL HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12 bg-white/[0.02] border border-white/10 p-8 md:p-10 rounded-[3rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-1">
           <div className="w-32 h-32 -mr-16 -mt-16 bg-primary blur-[60px] opacity-10 rounded-full"></div>
        </div>

        <div className="text-center lg:text-left space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-2">
             <FaMagic className="text-primary text-[10px]" />
             <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Neural Joiner</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight flex items-center justify-center lg:justify-start gap-4">
            Merge <span className="text-primary italic">PDFs</span>
          </h2>
          <p className="text-secondary/50 text-xs md:text-sm font-semibold uppercase tracking-[3px]">
             Drag cards to define sequence
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative z-10">
          <input type="file" multiple accept=".pdf" onChange={handleAddMore} id="more-pdf" className="hidden" />
          <label htmlFor="more-pdf" className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-white/5 text-white rounded-2xl cursor-pointer hover:bg-white/10 transition-all border border-white/5 font-bold text-[11px] uppercase tracking-widest group">
            <FaPlus className="text-primary group-hover:rotate-90 transition-transform" /> 
            Add Files
          </label>
          
          <button 
            onClick={onMerge}
            disabled={files.length < 2 || isProcessing}
            className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-primary text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-primary/20 disabled:opacity-30 disabled:grayscale transition-all hover:scale-[1.02] active:scale-95 group"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Merging...
              </>
            ) : (
              <>
                Confirm Merge <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* --- DRAGGABLE GRID --- */}
      <Reorder.Group 
        axis="x" 
        values={files} 
        onReorder={setFiles} 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {files.map((file) => (
            <Reorder.Item 
              key={file.id} 
              value={file}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              className="relative group aspect-[3/4.5] bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-6 flex flex-col items-center justify-between cursor-grab active:cursor-grabbing hover:border-primary/40 transition-all backdrop-blur-sm shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
                 <div className="w-20 h-20 -mr-10 -mt-10 bg-primary blur-2xl rounded-full"></div>
              </div>

              {/* Order Badge */}
              <div className="absolute top-6 left-6 bg-primary/10 border border-primary/20 text-primary w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold shadow-lg z-10">
                {files.indexOf(file) + 1}
              </div>

              {/* Delete Button (Visible on mobile/Touch, Hover on Desktop) */}
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl lg:opacity-0 lg:group-hover:opacity-100 transition-all z-20 shadow-xl shadow-red-500/20 active:scale-90"
              >
                <FaTrash size={12} />
              </button>

              {/* PDF Icon Area */}
              <div className="w-full flex-1 flex flex-col items-center justify-center pointer-events-none mt-4">
                <div className="relative group-hover:scale-110 transition-transform duration-500">
                   <FaFilePdf className="w-20 h-20 text-red-500/60" />
                   <div className="absolute -bottom-2 -right-2 bg-white text-red-600 text-[10px] font-black px-2 py-0.5 rounded shadow-lg border border-red-100">PDF</div>
                </div>
              </div>

              {/* File Info */}
              <div className="w-full text-center mt-6 pointer-events-none relative z-10">
                <p className="text-white text-xs font-bold truncate px-2 uppercase tracking-tight">
                  {file.name}
                </p>
                <p className="text-secondary/40 text-[10px] font-bold mt-2 uppercase tracking-widest tabular-nums">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>
              
              {/* Drag Indicator */}
              <div className="mt-4 text-white/10 group-hover:text-primary/40 transition-colors pointer-events-none">
                <FaGripVertical />
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {/* Empty State */}
      {files.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-40 bg-white/[0.01] border border-dashed border-white/10 rounded-[4rem]"
        >
           <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <FaFilePdf className="text-3xl text-secondary/20" />
           </div>
           <h3 className="text-xl font-semibold text-white/40 mb-4 tracking-tight">Merge queue is empty</h3>
           <p className="text-secondary/20 text-sm font-semibold uppercase tracking-widest">Add files to begin reconstruction</p>
        </motion.div>
      )}
    </div>
  );
};

export default MergeWorkspace;