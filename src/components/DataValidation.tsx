import { useEffect } from 'react';
import { useDataStore } from '../store/dataStore';
import type { ValidationResult } from '../types';

interface DataValidationProps {
  onEditMapping?: () => void;
  onChangeData?: () => void;
  onReset?: () => void;
}

export default function DataValidation({ onEditMapping, onChangeData, onReset }: DataValidationProps) {
  const { parsedData, setValidationResults, validationResults } = useDataStore();

  useEffect(() => {
    if (parsedData) {
      const results: ValidationResult[] = parsedData.columns.map((col) => {
        const values = parsedData.rows.map((row) => row[col]);
        const type = parsedData.types[col];

        const stats: ValidationResult['stats'] = {
          count: values.length,
        };

        if (type === 'number') {
          const nums = values.filter((v) => typeof v === 'number') as number[];
          stats.min = Math.min(...nums);
          stats.max = Math.max(...nums);
          stats.avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        }

        if (type === 'string') {
          stats.unique = new Set(values).size;
        }

        return { column: col, type, stats };
      });

      setValidationResults(results);
    }
  }, [parsedData, setValidationResults]);

  if (!parsedData || validationResults.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No data to validate</p>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'number':
        return '123';
      case 'string':
        return 'ABC';
      case 'date':
        return '📅';
      case 'boolean':
        return '✓✗';
      default:
        return '?';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'string':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'date':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'boolean':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatStat = (value: number | undefined) => {
    if (value === undefined) return '-';
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Data Validation</h2>
        <p className="text-lg md:text-xl text-gray-600">
          Review your data statistics before visualization
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onEditMapping}
          className="px-6 py-3 rounded-lg font-semibold text-base bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors flex items-center gap-2 border-2 border-cyan-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Edit Mapping</span>
        </button>

        <button
          onClick={onChangeData}
          className="px-6 py-3 rounded-lg font-semibold text-base bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center gap-2 border-2 border-purple-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Change Data</span>
        </button>

        <button
          onClick={onReset}
          className="px-6 py-3 rounded-lg font-semibold text-base bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-2 border-2 border-red-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Reset All</span>
        </button>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-cyan-50 to-purple-50 rounded-xl border-2 border-cyan-100 p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">File Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-cyan-600">
              {parsedData.rows.length}
            </div>
            <div className="text-sm md:text-base text-gray-600 mt-1">Rows</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-600">
              {parsedData.columns.length}
            </div>
            <div className="text-sm md:text-base text-gray-600 mt-1">Columns</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600">
              {validationResults.filter((r) => r.type === 'number').length}
            </div>
            <div className="text-sm md:text-base text-gray-600 mt-1">Numeric</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-600">
              {validationResults.filter((r) => r.type === 'string').length}
            </div>
            <div className="text-sm md:text-base text-gray-600 mt-1">Text</div>
          </div>
        </div>
      </div>

      {/* Column Details */}
      <div className="space-y-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">Column Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {validationResults.map((result) => (
            <div key={result.column} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">{result.column}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getTypeColor(result.type)}`}>
                  {getTypeIcon(result.type)} {result.type}
                </span>
              </div>

              <div className="space-y-2 text-sm md:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Count:</span>
                  <span className="font-semibold text-gray-900">{result.stats.count}</span>
                </div>
                {result.stats.unique !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unique:</span>
                    <span className="font-semibold text-gray-900">{result.stats.unique}</span>
                  </div>
                )}
                {result.stats.min !== undefined && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min:</span>
                      <span className="font-semibold text-gray-900">{formatStat(result.stats.min)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max:</span>
                      <span className="font-semibold text-gray-900">{formatStat(result.stats.max)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg:</span>
                      <span className="font-semibold text-gray-900">{formatStat(result.stats.avg)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
