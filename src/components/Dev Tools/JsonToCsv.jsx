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

      // Escape fields for CSV
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

  const handleDownload = () => {
    if (csvOutput) {
      const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
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
    <div className="flex flex-col gap-6 w-full font-semibold">
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs uppercase tracking-widest text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Area */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-4">
              <span className="text-xs text-white uppercase tracking-widest flex items-center gap-2">
                <span className="text-primary font-black">{'{ }'}</span> JSON Input
              </span>
              <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary text-[10px] px-3 py-1 rounded-lg border border-primary/20 transition-all">
                Upload Batch
                <input type="file" multiple accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <button 
              onClick={handleClear}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
              title="Clear Input"
            >
              <FaTrash className="text-xs" />
            </button>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[\n  { "id": 1, "name": "Ali" }\n]'
            className="w-full h-80 bg-black/40 border border-white/5 rounded-3xl p-6 text-sm text-blue-300 font-mono focus:outline-none focus:border-primary/50 transition-colors resize-none placeholder-blue-300/20 custom-scrollbar"
            spellCheck="false"
          />
        </div>

        {/* Output Area */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-xs text-white uppercase tracking-widest flex items-center gap-2">
              <FaFileCsv className="text-emerald-400" /> CSV Output
            </span>
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                disabled={!csvOutput}
                className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
                title="Copy CSV"
              >
                <FaCopy className="text-xs" />
              </button>
              <button 
                onClick={handleDownload}
                disabled={!csvOutput}
                className="p-2 bg-primary/20 hover:bg-primary/40 text-primary disabled:opacity-50 disabled:hover:bg-primary/20 rounded-lg transition-colors"
                title="Download CSV"
              >
                <FaDownload className="text-xs" />
              </button>
            </div>
          </div>
          <textarea
            value={csvOutput}
            readOnly
            placeholder="id,name&#10;1,Ali"
            className="w-full h-80 bg-black/40 border border-white/5 rounded-3xl p-6 text-sm text-emerald-300 font-mono focus:outline-none transition-colors resize-none placeholder-emerald-300/20 custom-scrollbar"
          />
        </div>
      </div>


      
    </div>
  );
};

export default JsonToCsv;
