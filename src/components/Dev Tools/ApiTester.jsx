import React, { useState } from 'react';
import { FaTerminal, FaPlay, FaArrowsRotate, FaTriangleExclamation, FaCopy } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ApiTester = () => {
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiUrl, setApiUrl] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runApiTest = async () => {
    if (!apiUrl) {
      toast.error("Please enter a URL");
      return;
    }
    setLoading(true);
    setApiResponse(null);
    setError('');
    try {
      const start = Date.now();
      const options = { 
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // Agar request GET nahi hai, toh body check aur parse krna zaroori hai
      if (apiMethod !== 'GET' && requestBody.trim()) {
        try {
          JSON.parse(requestBody);
          options.body = requestBody;
        } catch (e) {
          toast.error("Invalid JSON in Request Body");
          setLoading(false);
          return;
        }
      }

      // Fetch API ka use krke network request bhej rahe hain
      const res = await fetch(apiUrl, options);
      const duration = Date.now() - start;
      const data = await res.json().catch(() => "Selected URL doesn't return JSON or CORS is blocked.");
      
      setApiResponse({
        status: res.status,
        statusText: res.statusText,
        time: `${duration}ms`,
        data: data
      });
      toast.success("Request completed");
    } catch (e) {
      // Network ya parsing errors ko handle krna
      setError("Fetch Error: " + e.message + " (Check CORS or URL)");
      toast.error("Request failed");
    } finally {
      // Loading state ko khatam krna taake UI update ho sake
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap gap-3 bg-slate-100 p-2 rounded-[2rem] border border-slate-200 w-fit shadow-inner">
          {['GET', 'POST', 'PUT', 'DELETE'].map((method) => (
            <button
              key={method}
              onClick={() => setApiMethod(method)}
              className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[3px] transition-all ${
                apiMethod === method 
                  ? 'bg-slate-900 text-white shadow-xl' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="flex-1 relative group/url">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent blur-xl opacity-0 group-focus-within/url:opacity-100 transition-opacity"></div>
            <div className="relative flex bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden focus-within:border-primary/50 transition-all shadow-2xl">
              <input 
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder='https://api.example.com/v1/node'
                className="flex-1 px-8 py-6 outline-none font-mono text-sm text-slate-300 bg-transparent placeholder:text-slate-700"
              />
            </div>
          </div>
          <button 
            onClick={runApiTest}
            disabled={loading}
            className="bg-slate-900 hover:bg-primary disabled:opacity-50 text-white px-12 rounded-[2.5rem] font-black uppercase tracking-[4px] text-[10px] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 group min-h-[72px]"
          >
            {loading ? <FaArrowsRotate className="animate-spin" /> : <FaPlay className="group-hover:translate-x-1 transition-transform" />} 
            <span>{loading ? 'Transmitting...' : 'Dispatch'}</span>
          </button>
        </div>

        <AnimatePresence>
          {apiMethod !== 'GET' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-4"
            >
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <label className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Request Payload (JSON)</label>
                 </div>
                 <button onClick={() => {
                   try {
                     if (requestBody.trim()) {
                       setRequestBody(JSON.stringify(JSON.parse(requestBody), null, 2));
                       toast.success("JSON Structured");
                     }
                   } catch (e) {
                     toast.error("Invalid Structure");
                   }
                 }} className="text-[9px] font-black text-primary hover:text-white hover:bg-primary transition-all uppercase tracking-[3px] bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">Beautify Node</button>
              </div>
              <div className="relative group/body">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent blur-xl opacity-0 group-focus-within/body:opacity-100 transition-opacity"></div>
                <textarea 
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder='{ "neural_link": true }'
                  className="relative w-full h-[200px] bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 font-mono text-sm focus:border-primary/50 transition-all outline-none resize-none shadow-2xl custom-scrollbar text-slate-300 placeholder:text-slate-700"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="min-h-[500px] bg-slate-900 border border-slate-800 rounded-[4rem] overflow-hidden relative shadow-2xl">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-slate-900/60 backdrop-blur-md z-10"
            >
              <div className="relative">
                <div className="w-20 h-20 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-10 h-10 bg-primary/20 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-primary font-black uppercase tracking-[5px] text-[10px] animate-pulse">Pinging Node Infrastructure...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-20"
            >
              <div className="w-24 h-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center border border-rose-500/20 mb-8 shadow-2xl">
                <FaTriangleExclamation className="text-rose-500 text-4xl" />
              </div>
              <h3 className="text-rose-500 font-black uppercase tracking-[5px] text-xs mb-6">Protocol Fault: Request Terminated</h3>
              <div className="max-w-lg bg-rose-500/5 p-6 rounded-3xl border border-rose-500/10 shadow-inner">
                <p className="text-rose-400/70 text-xs font-mono leading-relaxed">{error}</p>
              </div>
              <button onClick={() => setError('')} className="mt-10 text-[9px] font-black uppercase text-slate-600 hover:text-rose-500 transition-colors tracking-[4px]">Purge Error Log</button>
            </motion.div>
          ) : apiResponse ? (
            <motion.div 
              key="response"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 space-y-10"
            >
              <div className="flex flex-wrap gap-6">
                <div className="bg-white/5 border border-white/5 px-8 py-5 rounded-[2rem] flex flex-col gap-2 min-w-[160px] shadow-inner">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[4px]">Status Header</p>
                  <div className="flex items-center gap-3">
                     <div className={`w-2.5 h-2.5 rounded-full ${apiResponse.status < 300 ? 'bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></div>
                     <p className={`text-2xl font-black ${apiResponse.status < 300 ? 'text-emerald-500' : 'text-rose-500'}`}>{apiResponse.status}</p>
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-[2px]">{apiResponse.statusText}</span>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/5 px-8 py-5 rounded-[2rem] flex flex-col gap-2 min-w-[160px] shadow-inner">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[4px]">Latency Pipeline</p>
                  <p className="text-2xl font-black text-primary font-mono">{apiResponse.time}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <label className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Response Payload</label>
                  <button 
                    onClick={() => handleCopy(JSON.stringify(apiResponse.data, null, 2))} 
                    className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[3px] hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-3"
                  >
                    <FaCopy /> Sync to Clip
                  </button>
                </div>
                <div className="w-full h-[450px] bg-black/30 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm text-emerald-400/90 overflow-auto custom-scrollbar whitespace-pre shadow-2xl selection:bg-emerald-500/20">
                  {apiResponse.data && (typeof apiResponse.data === 'string' ? apiResponse.data : JSON.stringify(apiResponse.data, null, 2))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-20"
            >
              <div className="w-24 h-24 bg-white/5 rounded-[3rem] flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                <FaTerminal className="text-slate-700 text-4xl" />
              </div>
              <p className="text-slate-700 font-black max-w-xs leading-relaxed uppercase tracking-[5px] text-[10px] opacity-40">Awaiting Dispatch Instruction...</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
};

export default ApiTester;
