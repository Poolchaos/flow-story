import { useDataStore } from '../store/dataStore';
import type { ColumnMapping } from '../types';

interface ColumnMapperProps {
  onContinue?: () => void;
}

export default function ColumnMapper({ onContinue }: ColumnMapperProps) {
  const { parsedData, columnMapping, setColumnMapping } = useDataStore();

  if (!parsedData) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Please upload data first</p>
      </div>
    );
  }

  const handleMappingChange = (axis: keyof ColumnMapping, value: string) => {
    setColumnMapping({
      ...columnMapping,
      [axis]: value || undefined,
    });
  };

  const canProceed = columnMapping.x && columnMapping.y && columnMapping.z;

  // Filter columns by type for appropriate mappings
  const numericColumns = parsedData.columns.filter(col => parsedData.types[col] === 'number');
  const categoricalColumns = parsedData.columns.filter(col => 
    parsedData.types[col] === 'string' || parsedData.types[col] === 'boolean'
  );

  const renderSelect = (
    label: string,
    axis: keyof ColumnMapping,
    required: boolean = false,
    tooltip?: string,
    columnFilter?: string[]
  ) => {
    const availableColumns = columnFilter || parsedData.columns;
    
    return (
      <div>
        <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          {tooltip && (
            <div className="relative group">
              <svg 
                className="w-5 h-5 text-gray-400 hover:text-cyan-600 cursor-help transition-colors" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute left-0 top-full mt-2 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 transform rotate-45"></div>
                {tooltip}
              </div>
            </div>
          )}
        </label>
        <select
          value={columnMapping[axis] || ''}
          onChange={(e) => handleMappingChange(axis, e.target.value)}
          className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        >
          <option value="">-- Select Column --</option>
          {availableColumns.map((col) => (
            <option key={col} value={col}>
              {col} ({parsedData.types[col]})
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Map Your Columns</h2>
        <p className="text-lg md:text-xl text-gray-600">
          Assign columns to visualization axes
        </p>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 md:p-8">
        {/* Required Fields */}
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Required Axes</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderSelect('X Axis', 'x', true)}
            {renderSelect('Y Axis', 'y', true)}
            {renderSelect('Z Axis', 'z', true)}
          </div>
        </div>

        {/* Optional Fields */}
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span>Optional Mappings</span>
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Enhance your visualization with additional data dimensions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderSelect(
              'Color', 
              'color', 
              false, 
              'Map a categorical column (text/boolean) to control color gradients. Text values assign distinct colors to different categories for easy comparison.',
              categoricalColumns
            )}
            {renderSelect(
              'Size', 
              'size', 
              false, 
              'Map a numeric column to control element sizes. Higher values create larger bars, particles, or spheres. Adds visual emphasis to important data points.',
              numericColumns
            )}
            {renderSelect(
              'Label', 
              'label', 
              false, 
              'Choose which column to display in hover tooltips as the primary identifier. Helpful for showing names, IDs, or descriptions when exploring data.'
            )}
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {!canProceed && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-yellow-800 font-medium">
            Please select X, Y, and Z axes to continue
          </p>
        </div>
      )}

      {canProceed && (
        <div className="space-y-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center justify-center gap-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-800 font-medium">
              All required axes mapped! Ready to validate your data.
            </p>
          </div>

          <button
            onClick={onContinue}
            className="w-full px-8 py-4 rounded-xl font-bold text-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <span>Continue to Validation</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
