import { useEffect } from 'react';
import { useDataStore } from '../store/dataStore';
import type { ValidationResult } from '../types';

export default function DataValidation() {
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
          Column types and statistics
        </p>
      </div>

      {/* File Overview */}
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
