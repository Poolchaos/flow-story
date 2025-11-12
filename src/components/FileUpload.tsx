import { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import Papa from 'papaparse';
import { useDataStore } from '../store/dataStore';
import type { ParsedData } from '../types';

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setCsvData, setParsedData, parsedData } = useDataStore();

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setFileName(file.name);
    setError(null);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      setCsvData(csvText);
      parseCSV(csvText);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText: string) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setError('CSV file is empty');
          setIsLoading(false);
          return;
        }

        const columns = Object.keys(results.data[0] as Record<string, unknown>);
        const rows = results.data as Record<string, string | number>[];

        // Detect column types
        const types: Record<string, 'number' | 'string' | 'date' | 'boolean'> = {};
        columns.forEach((col) => {
          const firstValue = rows[0]?.[col];
          if (typeof firstValue === 'number') {
            types[col] = 'number';
          } else if (typeof firstValue === 'boolean') {
            types[col] = 'boolean';
          } else if (firstValue && !isNaN(Date.parse(String(firstValue)))) {
            types[col] = 'date';
          } else {
            types[col] = 'string';
          }
        });

        const parsed: ParsedData = { columns, rows, types };
        setParsedData(parsed);
        setIsLoading(false);
      },
      error: (err: Error) => {
        setError(`Error parsing CSV: ${err.message}`);
        setIsLoading(false);
      },
    });
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSampleSelect = async (sampleName: string) => {
    setError(null);
    setIsLoading(true);
    setFileName(`Sample: ${sampleName}`);

    try {
      const basePath = import.meta.env.BASE_URL || '/';
      const response = await fetch(`${basePath}samples/${sampleName}.csv`);
      if (!response.ok) {
        throw new Error('Failed to load sample dataset');
      }
      const csvText = await response.text();
      setCsvData(csvText);
      parseCSV(csvText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sample');
      setIsLoading(false);
    }
  };

  const samples = [
    {
      id: 'sales-performance',
      name: 'Sales Performance',
      description: '48 rows - Regional sales data across quarters with revenue, units, and ratings',
      icon: (
        <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'weather-data',
      name: 'Weather Data',
      description: '84 rows - Monthly weather patterns for 7 US cities with temperature and humidity',
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Upload Your Data</h2>
        <p className="text-lg md:text-xl text-gray-600">Start by uploading a CSV file</p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-4 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer
          ${isDragging ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300 hover:border-gray-400 bg-white'}
        `}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>

          {isLoading ? (
            <div className="text-xl text-gray-600">Loading...</div>
          ) : fileName ? (
            <div className="text-xl text-gray-900 font-semibold">{fileName}</div>
          ) : (
            <>
              <div className="text-xl text-gray-600">
                Drag and drop your CSV file here, or click to browse
              </div>
              <button className="bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors">
                Browse Files
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-center">
          {error}
        </div>
      )}

      {/* Sample Datasets */}
      {!parsedData && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 justify-center">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-gray-500 font-medium">Or try a sample dataset</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {samples.map((sample) => (
              <button
                key={sample.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSampleSelect(sample.id);
                }}
                className="p-6 rounded-xl border-2 border-gray-200 hover:border-cyan-500 hover:bg-cyan-50 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{sample.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-cyan-700 mb-1">
                      {sample.name}
                    </h4>
                    <p className="text-sm text-gray-600">{sample.description}</p>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Data Preview */}
      {parsedData && parsedData.rows.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Data Preview</h3>
            <p className="text-sm text-gray-600 mt-1">
              {parsedData.rows.length} rows, {parsedData.columns.length} columns
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead className="bg-gray-50">
                <tr>
                  {parsedData.columns.map((col) => (
                    <th key={col} className="px-4 py-3 text-left font-semibold text-gray-900 border-b-2 border-gray-200">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedData.rows.slice(0, 5).map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    {parsedData.columns.map((col) => (
                      <td key={col} className="px-4 py-3 text-gray-700">
                        {String(row[col] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
