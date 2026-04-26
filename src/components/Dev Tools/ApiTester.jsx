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
      setError("Fetch Error: " + e.message + " (Check CORS or URL)");
      toast.error("Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2 bg-black/40 p-2 rounded-2xl border border-white/10 w-fit">
          {['GET', 'POST', 'PUT', 'DELETE'].map((method) => (
            <button
              key={method}
              onClick={() => setApiMethod(method)}
              className={`px-6 py-2 rounded-xl text-[10px] font-semibold tracking-widest transition-all ${
                apiMethod === method 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          <div className="flex-1 flex bg-black/40 border border-white/10 rounded-2xl overflow-hidden focus-within:border-primary/30 transition-all shadow-inner">
            <input 
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder='https://api.example.com/data'
              className="flex-1 px-6 py-4 outline-none font-mono text-sm text-blue-100 placeholder:text-slate-600"
            />
          </div>
          <button 
            onClick={runApiTest}
            disabled={loading}
            className="bg-primary hover:bg-blue-600 disabled:opacity-50 text-white px-10 rounded-2xl font-semibold transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 group"
          >
            {loading ? <FaArrowsRotate className="animate-spin" /> : <FaPlay className="group-hover:translate-x-0.5 transition-transform" />} 
            <span>{loading ? 'Sending...' : 'Send Request'}</span>
          </button>
        </div>

        <AnimatePresence>
          {apiMethod !== 'GET' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-3"
            >
              <div className="flex items-center justify-between">
                 <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Request Body (JSON)</label>
                 <button onClick={() => {
                   try {
                     if (requestBody.trim()) {
                       setRequestBody(JSON.stringify(JSON.parse(requestBody), null, 2));
                       toast.success("JSON Formatted");
                     }
                   } catch (e) {
                     toast.error("Invalid JSON in body");
                   }
                 }} className="text-[9px] font-semibold text-primary hover:text-blue-400 transition-colors uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">Beautify JSON</button>
              </div>
              <textarea 
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder='{ "key": "value" }'
                className="w-full h-[150px] bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-sm focus:border-primary/30 transition-all outline-none resize-none shadow-inner custom-scrollbar text-blue-100/70"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="min-h-[400px] bg-black/20 border border-white/5 rounded-[2rem] overflow-hidden relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-sm z-10"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-primary font-semibold uppercase tracking-widest text-[10px] animate-pulse">Requesting Server...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center p-12"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20 mb-6 rotate-12">
                <FaTriangleExclamation className="text-red-500 text-3xl -rotate-12" />
              </div>
              <h3 className="text-red-400 font-semibold uppercase tracking-widest text-sm mb-3">Request Failed</h3>
              <div className="max-w-md bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                <p className="text-red-300/70 text-xs font-mono leading-relaxed">{error}</p>
              </div>
              <button onClick={() => setError('')} className="mt-8 text-[10px] font-semibold uppercase text-slate-500 hover:text-white transition-colors underline decoration-slate-800 underline-offset-8">Clear Error</button>
            </motion.div>
          ) : apiResponse ? (
            <motion.div 
              key="response"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 space-y-8"
            >
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex flex-col gap-1 min-w-[120px]">
                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Status Code</p>
                  <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${apiResponse.status < 300 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                     <p className={`text-lg font-semibold ${apiResponse.status < 300 ? 'text-emerald-500' : 'text-red-500'}`}>{apiResponse.status}</p>
                     <span className="text-[10px] font-semibold text-slate-400 uppercase opacity-40">{apiResponse.statusText}</span>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex flex-col gap-1 min-w-[120px]">
                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Response Time</p>
                  <p className="text-lg font-semibold text-primary font-mono">{apiResponse.time}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Response Body</label>
                  <button 
                    onClick={() => handleCopy(JSON.stringify(apiResponse.data, null, 2))} 
                    className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-lg text-[9px] font-semibold uppercase hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                  >
                    <FaCopy /> Copy JSON
                  </button>
                </div>
                <div className="w-full h-[350px] bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-sm text-slate-300 overflow-auto custom-scrollbar whitespace-pre shadow-inner">
                  {apiResponse.data && (typeof apiResponse.data === 'string' ? apiResponse.data : JSON.stringify(apiResponse.data, null, 2))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="h-full flex flex-col items-center justify-center text-center p-20"
            >
              <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 border border-white/5">
                <FaTerminal className="text-slate-600 text-3xl" />
              </div>
              <p className="text-slate-500 font-medium max-w-xs leading-relaxed uppercase tracking-[0.2em] text-[10px]">Enter a URL and send request to see response details</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ApiTester;
