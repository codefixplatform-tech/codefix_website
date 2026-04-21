import React from 'react';
import { Reorder, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaFilePdf, FaArrowRight, FaGripVertical } from "react-icons/fa6";

const MergeWorkspace = ({ files, setFiles, onMerge, isProcessing }) => {
  
  const handleAddMore = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-3xl font-black text-white">Merge PDF</h2>
          <p className="text-secondary text-sm mt-1">Drag to reorder your files as needed</p>
        </div>
        
        <div className="flex items-center gap-4">
          <input type="file" multiple accept=".pdf" onChange={handleAddMore} id="more-pdf" className="hidden" />
          <label htmlFor="more-pdf" className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-2xl cursor-pointer hover:bg-white/20 transition-all border border-white/10 font-bold">
            <FaPlus className="text-primary" /> Add More
          </label>
          
          <button 
            onClick={onMerge}
            disabled={files.length < 2 || isProcessing}
            className="flex items-center gap-3 px-8 py-3 bg-primary text-white rounded-2xl font-black hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing ? "Merging..." : "Merge PDF"} <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Draggable Grid */}
      <Reorder.Group 
        axis="x" 
        values={files} 
        onReorder={setFiles} 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
      >
        <AnimatePresence>
          {files.map((file) => (
            <Reorder.Item 
              key={file.id} 
              value={file}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group aspect-[3/4.5] bg-surface/40 border border-white/10 rounded-[2rem] p-5 flex flex-col items-center justify-between cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all backdrop-blur-sm shadow-xl"
            >
              {/* Delete Button */}
              <button 
                onClick={() => removeFile(file.id)}
                className="absolute -top-2 -right-2 w-10 h-10 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg hover:bg-red-600"
              >
                <FaTrash size={14} />
              </button>

              {/* PDF Icon Area */}
              <div className="w-full flex-1 flex flex-col items-center justify-center pointer-events-none">
                <div className="relative">
                   <FaFilePdf className="w-20 h-20 text-red-500/80 mb-2" />
                   <div className="absolute -top-1 -right-1 bg-white text-red-600 text-[10px] font-black px-1 rounded">PDF</div>
                </div>
              </div>

              {/* File Info */}
              <div className="w-full text-center mt-2 pointer-events-none">
                <p className="text-white text-[11px] font-bold truncate px-1 uppercase tracking-tight">
                  {file.name}
                </p>
                <p className="text-slate-500 text-[9px] mt-1">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>

              {/* Order Badge */}
              <div className="absolute top-4 left-4 w-6 h-6 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center text-[10px] font-black text-primary">
                {files.indexOf(file) + 1}
              </div>
              
              {/* Drag Indicator */}
              <div className="absolute bottom-4 right-4 text-white/20 group-hover:text-primary/40 transition-colors">
                <FaGripVertical />
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
};

export default MergeWorkspace;