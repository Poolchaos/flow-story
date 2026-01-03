/*
 * Copyright (c) 2025 Phillip-Juan van der Berg. All Rights Reserved.
 *
 * This source code is licensed under the PolyForm Noncommercial License 1.0.0
 * found in the LICENSE file in the root directory of this source tree.
 *
 * For commercial licensing, contact: phillipjuanvanderberg@gmail.com
 */

import { create } from 'zustand';
import type { ParsedData, ColumnMapping, ValidationResult, Waypoint } from '../types';

interface DataStore {
  // State
  csvData: string | null;
  parsedData: ParsedData | null;
  columnMapping: ColumnMapping;
  validationResults: ValidationResult[];
  waypoints: Waypoint[];

  // Actions
  setCsvData: (data: string) => void;
  setParsedData: (data: ParsedData | null) => void;
  setColumnMapping: (mapping: ColumnMapping) => void;
  setValidationResults: (results: ValidationResult[]) => void;
  addWaypoint: (waypoint: Waypoint) => void;
  updateWaypoint: (id: string, updates: Partial<Waypoint>) => void;
  deleteWaypoint: (id: string) => void;
  clearWaypoints: () => void;
  clearData: () => void;
}

export const useDataStore = create<DataStore>((set) => ({
  // Initial state
  csvData: null,
  parsedData: null,
  columnMapping: {},
  validationResults: [],
  waypoints: [],

  // Actions
  setCsvData: (data) => set({ csvData: data }),
  setParsedData: (data) => set({ parsedData: data }),
  setColumnMapping: (mapping) => set({ columnMapping: mapping }),
  setValidationResults: (results) => set({ validationResults: results }),
  addWaypoint: (waypoint) => set((state) => ({ waypoints: [...state.waypoints, waypoint] })),
  updateWaypoint: (id, updates) => set((state) => ({
    waypoints: state.waypoints.map((w) => (w.id === id ? { ...w, ...updates } : w)),
  })),
  deleteWaypoint: (id) => set((state) => ({
    waypoints: state.waypoints.filter((w) => w.id !== id),
  })),
  clearWaypoints: () => set({ waypoints: [] }),
  clearData: () => set({
    csvData: null,
    parsedData: null,
    columnMapping: {},
    validationResults: [],
    waypoints: [],
  }),
}));
