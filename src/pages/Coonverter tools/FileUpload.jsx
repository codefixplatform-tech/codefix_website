import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaCloudUploadAlt, 
  FaFilePdf, 
  FaFileWord, 
  FaFileExcel, 
  FaFileImage, 
  FaArrowLeft, 
  FaCheckCircle, 
  FaTrashAlt,
  FaSyncAlt,
  FaDownload,
  FaRocket,
  FaLayerGroup 
} from "react-icons/fa";
import { FaFileZipper, FaScissors } from "react-icons/fa6";
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';

// Components
import MergeWorkspace from './MergeWorkspace';
import SplitWorkspace from './SplitWorkspace';

// Utils Imports
import { convertImageToPdf } from '../../utils/converters/imageToPdf';
import { compressPdf } from '../../utils/converters/compressPdf';
import { convertPdfToWord } from '../../utils/converters/pdfToWord';
import { mergePdf } from '../../utils/converters/mergePdf';
import { splitPdf } from '../../utils/converters/splitPdf';
import { convertWordToPdf } from '../../utils/converters/wordToPdf'; // Word Utility
import { convertExcelToPdf } from '../../utils/converters/excelToPdf';

const FileUpload = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [file, setFile] = useState(null); 
  const [mergeFiles, setMergeFiles] = useState([]);
  const [splitFile, setSplitFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); 
  const [downloadData, setDownloadData] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getToolDetails = (id) => {
    switch(id) {
      case 'pdf-to-word': return { title: "PDF to Word", icon: <FaFilePdf />, color: "text-red-500", accept: ".pdf", multiple: false };
      case 'word-to-pdf': return { title: "Word to PDF", icon: <FaFileWord />, color: "text-blue-500", accept: ".doc,.docx", multiple: false };
      case 'excel-to-pdf': return { title: "Excel to PDF", icon: <FaFileExcel />, color: "text-emerald-500", accept: ".xls,.xlsx", multiple: false };
      case 'image-to-pdf': return { title: "Image to PDF", icon: <FaFileImage />, color: "text-purple-500", accept: "image/*", multiple: false };
      case 'compress-pdf': return { title: "Compress PDF", icon: <FaFileZipper />, color: "text-orange-500", accept: ".pdf", multiple: false };
      case 'merge-pdf': return { title: "Merge PDF", icon: <FaLayerGroup />, color: "text-indigo-500", accept: ".pdf", multiple: true };
      case 'split-pdf': return { title: "Split PDF", icon: <FaScissors />, color: "text-pink-500", accept: ".pdf", multiple: false };
      default: return { title: "File Converter", icon: <FaCloudUploadAlt />, color: "text-primary", accept: "*", multiple: false };
    }
  };

  const tool = getToolDetails(toolId);

  const runProgressAnimation = (duration = 2000) => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) return prev + 2;
        clearInterval(interval);
        return prev;
      });
    }, duration / 45);
    return interval;
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (toolId === 'merge-pdf') {
      const wrapped = [{ id: uuidv4(), file: selectedFile, name: selectedFile.name, size: selectedFile.size }];
      setMergeFiles(prev => [...prev, ...wrapped]);
      toast.success("File added to merge list");
    } else if (toolId === 'split-pdf') {
      setSplitFile(selectedFile);
      toast.success("PDF loaded for splitting");
    } else {
      setFile(selectedFile);
      startConversion(selectedFile);
    }
  };

  const handleMergeSelection = (e) => {
    const selected = Array.from(e.target.files).map(f => ({
      id: uuidv4(),
      file: f,
      name: f.name,
      size: f.size
    }));
    setMergeFiles(prev => [...prev, ...selected]);
    toast.success(`${selected.length} files added`);
  };

  const startConversion = async (selectedFile) => {
    setStatus('processing');
    const anim = runProgressAnimation(toolId === 'word-to-pdf' ? 4000 : 2000);
    try {
      let result = null;
      if (toolId === 'image-to-pdf') result = await convertImageToPdf(selectedFile);
      else if (toolId === 'compress-pdf') result = await compressPdf(selectedFile);
      else if (toolId === 'pdf-to-word') result = await convertPdfToWord(selectedFile);
      else if (toolId === 'word-to-pdf') result = await convertWordToPdf(selectedFile);
      else if (toolId === 'excel-to-pdf') result = await convertExcelToPdf(selectedFile);
      
      clearInterval(anim);
      setProgress(100);
      setDownloadData(result);
      setTimeout(() => {
        setStatus('completed');
        toast.success("Done! Your file is ready.");
      }, 500);
    } catch (error) {
      clearInterval(anim);
      setStatus('idle');
      toast.error("Process failed! Try again.");
    }
  };

  const startMerge = async () => {
    if (mergeFiles.length < 2) {
      toast.error("Please select at least 2 files");
      return;
    }
    setStatus('processing');
    const anim = runProgressAnimation(2500);
    try {
      const result = await mergePdf(mergeFiles);
      clearInterval(anim);
      setProgress(100);
      setDownloadData(result);
      setTimeout(() => { setStatus('completed'); }, 500);
    } catch (error) {
      clearInterval(anim);
      setStatus('idle');
      toast.error("Merge failed!");
    }
  };

  const startSplit = async (selectedIndices) => {
    setStatus('processing');
    const anim = runProgressAnimation(2000);
    try {
      const result = await splitPdf(splitFile, selectedIndices);
      clearInterval(anim);
      setProgress(100);
      setDownloadData(result);
      setTimeout(() => { setStatus('completed'); }, 500);
    } catch (error) {
      clearInterval(anim);
      setStatus('idle');
      toast.error("Split failed!");
    }
  };

  const handleDownload = () => {
    if (downloadData) {
      const link = document.createElement('a');
      link.href = downloadData.downloadUrl;
      link.download = downloadData.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const reset = () => {
    setFile(null);
    setMergeFiles([]);
    setSplitFile(null);
    setProgress(0);
    setStatus('idle');
    setDownloadData(null);
  };

  if (toolId === 'merge-pdf' && mergeFiles.length > 0 && status === 'idle') {
    return (
      <div className="min-h-screen bg-background pt-20 animate-in fade-in duration-500">
          <button onClick={reset} className="ml-10 mb-5 flex items-center gap-2 text-slate-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <FaArrowLeft /> Clear All
          </button>
          <MergeWorkspace files={mergeFiles} setFiles={setMergeFiles} onMerge={startMerge} isProcessing={status === 'processing'} />
      </div>
    );
  }

  if (toolId === 'split-pdf' && splitFile && status === 'idle') {
    return (
      <div className="min-h-screen bg-background pt-20 animate-in fade-in duration-500">
          <button onClick={reset} className="ml-10 mb-5 flex items-center gap-2 text-slate-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <FaArrowLeft /> Restart
          </button>
          <SplitWorkspace file={splitFile} onProcess={startSplit} isProcessing={status === 'processing'} />
      </div>
    );
  }

  const isDashboard = location.pathname.startsWith('/dashboard');
  
  const handleBack = () => {
    if (isDashboard) {
      navigate('/dashboard/tools');
    } else {
      navigate('/tools');
    }
  };

  return (
    <div className={`bg-background text-white relative overflow-hidden flex items-center justify-center font-sans ${isDashboard ? 'min-h-[70vh] py-10' : 'min-h-screen py-20 px-4'}`}>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' } }} />
      
      {!isDashboard && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[130px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full"></div>
        </div>
      )}

      <div className={`w-full ${isDashboard ? 'max-w-5xl' : 'max-w-4xl'}`}>
        <button onClick={handleBack} className="flex items-center gap-3 text-slate-400 hover:text-primary transition-all mb-10 group">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-black uppercase tracking-[2px] text-[11px]">Back to Tools</span>
        </button>

        <div className="bg-surface/30 border border-white/10 backdrop-blur-3xl rounded-[3.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden transition-all duration-700">
          <div className="relative z-10 text-center">

            {status === 'idle' && (
              <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transition-all duration-500 bg-white/5 border border-white/10 ${tool.color} hover:scale-110`}>
                  {React.cloneElement(tool.icon, { className: "w-12 h-12" })}
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">{tool.title}</h1>
                <p className="text-secondary mb-12 max-w-lg mx-auto font-medium opacity-80 leading-relaxed italic">
                  100% Secure & Local. Your files never leave your browser.
                </p>

                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current.click()}
                  className={`group relative border-2 border-dashed rounded-[2.5rem] p-16 transition-all duration-500 cursor-pointer
                    ${isDragging ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-white/10 bg-white/5 hover:border-primary/40 hover:bg-primary/5'}`}
                >
                  <input type="file" ref={fileInputRef} className="hidden" multiple={tool.multiple} accept={tool.accept} onChange={(e) => toolId === 'merge-pdf' ? handleMergeSelection(e) : handleFile(e.target.files[0])} />
                  <FaCloudUploadAlt className={`w-16 h-16 mx-auto mb-6 transition-colors duration-500 ${isDragging ? 'text-primary' : 'text-slate-500 group-hover:text-primary'}`} />
                  <h3 className="text-2xl font-black text-white mb-2">Choose {toolId === 'merge-pdf' ? 'Files' : 'File'}</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Or drag and drop here</p>
                </div>
              </div>
            )}

            {status === 'processing' && (
              <div className="animate-in zoom-in-95 duration-500 py-12">
                <FaSyncAlt className="w-16 h-16 text-primary animate-spin mx-auto mb-8" />
                <h2 className="text-4xl font-black mb-2 tracking-tighter">Processing...</h2>
                <div className="max-w-md mx-auto relative px-4">
                  <div className="h-4 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden p-[2px]">
                    <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)]" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="mt-6 font-black text-primary text-2xl tracking-tighter">{progress}%</div>
                </div>
              </div>
            )}

            {status === 'completed' && (
              <div className="animate-in zoom-in-95 duration-500 py-6">
                <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/10 scale-110">
                  <FaCheckCircle className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Success!</h2>
                
                {/* Stats Section for Compression */}
                {toolId === 'compress-pdf' && downloadData?.stats && (
                  <div className="flex gap-4 justify-center mb-8">
                    <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-500 uppercase">Original</p>
                      <p className="text-white font-black">{downloadData.stats.original}</p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl">
                      <p className="text-[10px] font-black text-emerald-500 uppercase">Saving</p>
                      <p className="text-emerald-500 font-black">{downloadData.stats.ratio} Less</p>
                    </div>
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-2xl mx-auto backdrop-blur-sm">
                   <div className="flex items-center gap-5 text-left">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><FaRocket /></div>
                      <div>
                        <h4 className="font-black text-white truncate max-w-[180px] md:max-w-xs">{downloadData?.fileName}</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ready for Download</p>
                      </div>
                   </div>
                   <button onClick={handleDownload} className="w-full md:w-auto bg-primary hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/30 active:scale-95 group">
                      <FaDownload className="group-hover:translate-y-1 transition-transform" /> Download
                   </button>
                </div>
                <button onClick={reset} className="text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] underline underline-offset-8">Convert Another File</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;