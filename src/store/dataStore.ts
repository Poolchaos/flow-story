import { create } from 'zustand';
import type { ParsedData, ColumnMapping, ValidationResult } from '../types';

interface DataStore {
  // State
  csvData: string | null;
  parsedData: ParsedData | null;
  columnMapping: ColumnMapping;
  validationResults: ValidationResult[];

  // Actions
  setCsvData: (data: string) => void;
  setParsedData: (data: ParsedData | null) => void;
  setColumnMapping: (mapping: ColumnMapping) => void;
  setValidationResults: (results: ValidationResult[]) => void;
  clearData: () => void;
}

export const useDataStore = create<DataStore>((set) => ({
  // Initial state
  csvData: null,
  parsedData: null,
  columnMapping: {},
  validationResults: [],

  // Actions
  setCsvData: (data) => set({ csvData: data }),
  setParsedData: (data) => set({ parsedData: data }),
  setColumnMapping: (mapping) => set({ columnMapping: mapping }),
  setValidationResults: (results) => set({ validationResults: results }),
  clearData: () => set({
    csvData: null,
    parsedData: null,
    columnMapping: {},
    validationResults: [],
  }),
}));
