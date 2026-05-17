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
  FaLayerGroup,
  FaFilePowerpoint
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
import { mergePdf } from '../../utils/converters/mergePdf';
import { splitPdf } from '../../utils/converters/splitPdf';

const CONVERSION_API_URL = "https://script.google.com/macros/s/AKfycbwgxy7oxokXZG_5T83cafu2c3gKkVgMs9rJKwVIof9r9ytkbMlyRwZSlNYSRTX-EpQHvw/exec";

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
      case 'pptx-to-pdf': return { title: "PPTX to PDF", icon: <FaFilePowerpoint />, color: "text-red-600", accept: ".pptx", multiple: false };
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
      toast.success("File added to the merge list.");
    } else if (toolId === 'split-pdf') {
      setSplitFile(selectedFile);
      toast.success("PDF loaded for processing.");
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
    toast.success(`${selected.length} files successfully added.`);
  };

  const handleApiConversion = async (selectedFile, targetFormat) => {
    const reader = new FileReader();
    const base64Promise = new Promise((resolve) => {
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(selectedFile);
    });
    
    const base64 = await base64Promise;
    console.log("Starting Stable API Conversion for:", selectedFile.name);
    
    try {
        const params = new URLSearchParams();
        params.append('jsonData', JSON.stringify({
            fileName: selectedFile.name,
            base64: base64,
            targetFormat: targetFormat
        }));

        const response = await fetch(CONVERSION_API_URL, {
            method: 'POST',
            body: params
        });
        
        console.log("API Response Status:", response.status);
        const result = await response.json();
        console.log("API Result:", result);

        if (!result.success) throw new Error(result.error || "API Conversion failed");

        // Convert result base64 back to blob
        const byteCharacters = atob(result.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });
        
        return {
            downloadUrl: URL.createObjectURL(blob),
            fileName: result.fileName
        };
    } catch (err) {
        console.error("Fetch/API Error:", err);
        throw err;
    }
  };

  const startConversion = async (selectedFile) => {
    setStatus('processing');
    const anim = runProgressAnimation(toolId === 'word-to-pdf' ? 4000 : 2000);
    try {
      let result = null;
      
      // Determine if we should use Cloud API or Local Engine
      const useApi = ['pdf-to-word', 'word-to-pdf', 'excel-to-pdf', 'pptx-to-pdf'].includes(toolId);

      if (useApi) {
        const targetMap = {
            'pdf-to-word': 'docx',
            'word-to-pdf': 'pdf',
            'excel-to-pdf': 'pdf',
            'pptx-to-pdf': 'pdf'
        };
        result = await handleApiConversion(selectedFile, targetMap[toolId]);
      } 
      else if (toolId === 'image-to-pdf') result = await convertImageToPdf(selectedFile);
      else if (toolId === 'compress-pdf') result = await compressPdf(selectedFile);
      
      clearInterval(anim);
      setProgress(100);
      setDownloadData(result);
      setTimeout(() => {
        setStatus('completed');
        toast.success("Processing complete. Your file is ready.");
      }, 500);
    } catch (error) {
      clearInterval(anim);
      setStatus('idle');
      console.error("Conversion Error:", error);
      toast.error(`Conversion failed: ${error.message || "Please try again"}`);
    }
  };

  const startMerge = async () => {
    if (mergeFiles.length < 2) {
      toast.error("Please select at least two files to merge.");
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
      toast.error("Merge process failed.");
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
      toast.error("Split process failed.");
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <button onClick={reset} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-xs font-bold uppercase tracking-widest group">
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary/30 transition-all bg-white">
                <FaArrowLeft size={10} />
              </div>
              Clear All
            </button>
          </div>
          <MergeWorkspace files={mergeFiles} setFiles={setMergeFiles} onMerge={startMerge} isProcessing={status === 'processing'} />
      </div>
    );
  }

  if (toolId === 'split-pdf' && splitFile && status === 'idle') {
    return (
      <div className="min-h-screen bg-background pt-20 animate-in fade-in duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <button onClick={reset} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-xs font-bold uppercase tracking-widest group">
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary/30 transition-all bg-white">
                <FaArrowLeft size={10} />
              </div>
              Restart
            </button>
          </div>
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
    <div className={`relative min-h-screen bg-background text-slate-900 overflow-hidden font-sans ${isDashboard ? 'pt-6' : 'pt-20'}`}>
      <Toaster 
        position="top-center" 
        containerStyle={{ top: 110 }}
        toastOptions={{ style: { background: '#0F172A', color: '#fff', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', fontWeight: '600' } }} 
      />
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 relative z-10 py-12 md:py-24">
        <button onClick={handleBack} className="flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all mb-12 group">
          <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all bg-white shadow-sm">
            <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-bold uppercase tracking-[3px] text-[10px]">Back to Ecosystem</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all duration-700 relative overflow-hidden group">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 p-12">
            <div className="w-64 h-64 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-all"></div>
          </div>

          <div className="relative z-10 text-center">

            {status === 'idle' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-sm transition-all duration-500 bg-slate-50 border border-slate-100 ${tool.color} group-hover:scale-110 group-hover:rotate-3`}>
                  {React.cloneElement(tool.icon, { className: "w-14 h-14" })}
                </div>
                <h1 className="text-3xl md:text-5xl font-semibold font-heading text-slate-900 mb-3 tracking-tighter leading-[0.9]">{tool.title}</h1>
                <p className="text-slate-500 mb-8 max-w-xl mx-auto font-medium text-sm md:text-base leading-relaxed opacity-80 italic">
                  Powered by Neural Core v2.0. 100% Secure & Local.
                </p>

                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current.click()}
                  className={`group/upload relative border-2 border-dashed rounded-[2rem] p-8 md:p-12 transition-all duration-500 cursor-pointer
                    ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-slate-200 bg-slate-50 hover:border-primary/40 hover:bg-primary/5 hover:shadow-2xl hover:shadow-primary/5'}`}
                >
                  <input type="file" ref={fileInputRef} className="hidden" multiple={tool.multiple} accept={tool.accept} onChange={(e) => toolId === 'merge-pdf' ? handleMergeSelection(e) : handleFile(e.target.files[0])} />
                  <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center mx-auto mb-6 transition-all group-hover/upload:scale-110 group-hover/upload:bg-primary group-hover/upload:text-white">
                    <FaCloudUploadAlt className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-semibold font-heading text-slate-900 mb-2 tracking-tight">Drop {toolId === 'merge-pdf' ? 'Files' : 'File'} Here</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-[4px] text-[10px]">Or click to browse storage</p>
                </div>
              </div>
            )}

            {status === 'processing' && (
              <div className="animate-in zoom-in-95 duration-700 py-20">
                <div className="relative w-24 h-24 mx-auto mb-12">
                   <FaSyncAlt className="w-full h-full text-primary animate-spin opacity-20" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary rounded-full animate-ping"></div>
                   </div>
                </div>
                <h2 className="text-4xl md:text-6xl font-semibold font-heading mb-4 tracking-tighter text-slate-900 leading-none">Synthesizing...</h2>
                <div className="max-w-xl mx-auto relative px-4 mt-12">
                  <div className="h-5 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-1 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-primary via-blue-500 to-indigo-600 rounded-full transition-all duration-500 shadow-lg shadow-primary/20" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="mt-8 font-semibold text-primary text-4xl font-heading tracking-tighter italic">{progress}%</div>
                  <p className="text-slate-400 font-bold uppercase tracking-[4px] text-[10px] mt-4">Local Neural Engine in Action</p>
                </div>
              </div>
            )}

            {status === 'completed' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 py-10">
                <div className="w-28 h-28 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-sm scale-110">
                  <FaCheckCircle className="w-14 h-14 text-emerald-500" />
                </div>
                <h2 className="text-5xl md:text-7xl font-semibold font-heading mb-4 tracking-tighter text-slate-900 leading-none">Process Complete.</h2>
                
                {toolId === 'compress-pdf' && downloadData?.stats && (
                  <div className="flex gap-6 justify-center mb-12">
                    <div className="bg-slate-50 border border-slate-200 px-8 py-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[3px]">Original</p>
                      <p className="text-slate-900 font-bold text-xl">{downloadData.stats.original}</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 px-8 py-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[3px]">Reduced</p>
                      <p className="text-emerald-600 font-bold text-xl">{downloadData.stats.ratio} Less</p>
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-10 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-10 max-w-3xl mx-auto shadow-sm group/file">
                   <div className="flex items-center gap-6 text-left">
                      <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-primary text-2xl shadow-sm group-hover/file:scale-110 transition-transform"><FaRocket /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg md:text-xl truncate max-w-[180px] md:max-w-xs">{downloadData?.fileName}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[4px]">Neural Payload Ready</p>
                      </div>
                   </div>
                   <button onClick={handleDownload} className="w-full md:w-auto bg-slate-900 hover:bg-primary text-white px-12 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 group/btn text-base uppercase tracking-widest">
                      <FaDownload className="group-hover/btn:translate-y-1 transition-transform" /> Download File
                   </button>
                </div>
                <button onClick={reset} className="text-slate-400 hover:text-slate-900 font-bold uppercase tracking-[4px] text-[10px] underline underline-offset-8 transition-colors">Synthesize Another Asset</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;