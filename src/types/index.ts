export interface ParsedData {
  columns: string[];
  rows: Record<string, string | number>[];
  types: Record<string, 'number' | 'string' | 'date' | 'boolean'>;
}

export interface ColumnMapping {
  x?: string;
  y?: string;
  z?: string;
  color?: string;
  size?: string;
  label?: string;
}

export interface ValidationResult {
  column: string;
  type: 'number' | 'string' | 'date' | 'boolean';
  stats: {
    count: number;
    unique?: number;
    min?: number;
    max?: number;
    avg?: number;
  };
}

export interface Waypoint {
  id: string;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  annotation: string;
  timestamp: number;
}

export type Template = 'bars' | 'particles' | 'spheres';
