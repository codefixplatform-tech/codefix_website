import React, { useState, useEffect } from 'react';
import { FaFileCsv, FaExchangeAlt, FaCopy, FaDownload, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const JsonToCsv = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setCsvOutput('');
    
    if (!jsonInput.trim()) {
      return; // Clear output if input is empty, no error needed
    }

    try {
      const parsedData = JSON.parse(jsonInput);
      
      // Ensure data is an array
      let dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];

      if (dataArray.length === 0) {
        setError('JSON array is empty.');
        return;
      }

      // Collect all unique headers
      const headers = new Set();
      dataArray.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => headers.add(key));
        }
      });

      const headerArray = Array.from(headers);

      if (headerArray.length === 0) {
        setError('No valid objects found in JSON.');
        return;
      }

      // Escape fields for CSV wrape , " into ""
      const escapeField = (field) => {
        if (field === null || field === undefined) return '';
        const stringField = String(field);
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      };

      // Build CSV String
      let csv = headerArray.join(',') + '\n';
      
      dataArray.forEach(row => {
        if (typeof row === 'object' && row !== null) {
          const rowValues = headerArray.map(header => escapeField(row[header]));
          csv += rowValues.join(',') + '\n';
        }
      });

      setCsvOutput(csv);
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  }, [jsonInput]);

  const handleCopy = () => {
    if (csvOutput) {
      navigator.clipboard.writeText(csvOutput);
      toast.success('CSV copied to clipboard!');
    }
  };

  // Download CSV binary large object (blob)
  const handleDownload = () => {
    if (csvOutput) {
      const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
      // Create a download link and trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'data.csv';
      link.click();
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setCsvOutput('');
    setError('');
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const loaders = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = JSON.parse(event.target.result);
            resolve(Array.isArray(json) ? json : [json]);
          } catch (err) {
            reject(`File ${file.name} is not a valid JSON.`);
          }
        };
        reader.readAsText(file);
      });
    });

    toast.promise(Promise.all(loaders), {
      loading: 'Processing files...',
      success: (dataArrays) => {
        const merged = dataArrays.flat();
        setJsonInput(JSON.stringify(merged, null, 2));
        return `Batch processed ${files.length} files!`;
      },
      error: (err) => err
    });
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[4px] text-center shadow-xl flex items-center justify-center gap-4">
          <div className="w-8 h-8 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
             <FaTrash className="text-xs" />
          </div>
          Parsing Violation: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Input Area */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <label className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Source (JSON)</label>
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-900 text-[9px] px-3 py-1.5 rounded-lg transition-all font-black uppercase tracking-[2px] shadow-sm">
                Batch Upload
                <input type="file" multiple accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <button 
              onClick={handleClear}
              className="text-slate-400 hover:text-rose-500 transition-colors text-[10px] flex items-center gap-2 font-black uppercase tracking-[3px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"
            >
              <FaTrash className="text-xs" /> Reset
            </button>
          </div>
          <div className="relative group/input">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[\n  { "id": 1, "name": "Matrix" }\n]'
              className="relative w-full h-[400px] bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 text-sm text-slate-300 font-mono focus:outline-none focus:border-primary/50 transition-all resize-none placeholder:text-slate-700 custom-scrollbar"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Output Area */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-4">
            <label className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Export (CSV)</label>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleCopy}
                disabled={!csvOutput}
                className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-[2px] border border-emerald-500/20 disabled:opacity-30"
              >
                <FaCopy className="text-xs" /> Copy
              </button>
              <button 
                onClick={handleDownload}
                disabled={!csvOutput}
                className="bg-slate-900 text-white hover:bg-primary px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-[2px] shadow-xl disabled:opacity-30"
              >
                <FaDownload className="text-xs" /> Download
              </button>
            </div>
          </div>
          <div className="relative group/output">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-transparent blur-xl opacity-0 group-hover/output:opacity-100 transition-opacity"></div>
            <textarea
              value={csvOutput}
              readOnly
              placeholder="id,name&#10;1,Matrix"
              className="relative w-full h-[400px] bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 text-sm text-emerald-400 font-mono focus:outline-none transition-all resize-none placeholder:text-slate-700 custom-scrollbar"
            />
          </div>
        </div>
      </div>


      
    </div>
  );
};

export default JsonToCsv;
