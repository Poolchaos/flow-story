import { describe, it, expect, beforeEach } from 'vitest';
import { useDataStore } from './dataStore';
import type { ParsedData, ColumnMapping, ValidationResult, Waypoint } from '../types';

describe('dataStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useDataStore.getState().clearData();
  });

  describe('initial state', () => {
    it('should have null csvData', () => {
      const { csvData } = useDataStore.getState();
      expect(csvData).toBeNull();
    });

    it('should have null parsedData', () => {
      const { parsedData } = useDataStore.getState();
      expect(parsedData).toBeNull();
    });

    it('should have empty columnMapping', () => {
      const { columnMapping } = useDataStore.getState();
      expect(columnMapping).toEqual({});
    });

    it('should have empty validationResults', () => {
      const { validationResults } = useDataStore.getState();
      expect(validationResults).toEqual([]);
    });

    it('should have empty waypoints array', () => {
      const { waypoints } = useDataStore.getState();
      expect(waypoints).toEqual([]);
    });
  });

  describe('setCsvData', () => {
    it('should update csvData', () => {
      const testData = 'name,age,city\nJohn,30,NYC\nJane,25,LA';
      useDataStore.getState().setCsvData(testData);

      const { csvData } = useDataStore.getState();
      expect(csvData).toBe(testData);
    });

    it('should handle empty string', () => {
      useDataStore.getState().setCsvData('');

      const { csvData } = useDataStore.getState();
      expect(csvData).toBe('');
    });
  });

  describe('setParsedData', () => {
    it('should update parsedData', () => {
      const testData: ParsedData = {
        columns: ['name', 'age', 'city'],
        rows: [
          { name: 'John', age: '30', city: 'NYC' },
          { name: 'Jane', age: '25', city: 'LA' },
        ],
        types: {
          name: 'string',
          age: 'number',
          city: 'string',
        },
      };

      useDataStore.getState().setParsedData(testData);

      const { parsedData } = useDataStore.getState();
      expect(parsedData).toEqual(testData);
    });

    it('should handle null parsedData', () => {
      useDataStore.getState().setParsedData(null);

      const { parsedData } = useDataStore.getState();
      expect(parsedData).toBeNull();
    });

    it('should overwrite existing parsedData', () => {
      const firstData: ParsedData = {
        columns: ['x'],
        rows: [{ x: '1' }],
        types: { x: 'number' },
      };
      const secondData: ParsedData = {
        columns: ['y'],
        rows: [{ y: '2' }],
        types: { y: 'number' },
      };

      useDataStore.getState().setParsedData(firstData);
      useDataStore.getState().setParsedData(secondData);

      const { parsedData } = useDataStore.getState();
      expect(parsedData).toEqual(secondData);
    });
  });  describe('setColumnMapping', () => {
    it('should update columnMapping', () => {
      const mapping: ColumnMapping = {
        x: 'age',
        y: 'salary',
        z: 'experience',
      };

      useDataStore.getState().setColumnMapping(mapping);

      const { columnMapping } = useDataStore.getState();
      expect(columnMapping).toEqual(mapping);
    });

    it('should handle optional mappings', () => {
      const mapping: ColumnMapping = {
        x: 'age',
        y: 'salary',
        color: 'department',
        size: 'performance',
        label: 'name',
      };

      useDataStore.getState().setColumnMapping(mapping);

      const { columnMapping } = useDataStore.getState();
      expect(columnMapping).toEqual(mapping);
    });

    it('should overwrite existing columnMapping', () => {
      const firstMapping: ColumnMapping = { x: 'a', y: 'b' };
      const secondMapping: ColumnMapping = { x: 'c', y: 'd' };

      useDataStore.getState().setColumnMapping(firstMapping);
      useDataStore.getState().setColumnMapping(secondMapping);

      const { columnMapping } = useDataStore.getState();
      expect(columnMapping).toEqual(secondMapping);
    });
  });

  describe('setValidationResults', () => {
    it('should update validationResults', () => {
      const results: ValidationResult[] = [
        {
          column: 'age',
          type: 'number',
          stats: {
            count: 100,
            unique: 50,
            min: 18,
            max: 65,
            avg: 35.5,
          },
        },
        {
          column: 'name',
          type: 'string',
          stats: {
            count: 100,
            unique: 100,
          },
        },
      ];

      useDataStore.getState().setValidationResults(results);

      const { validationResults } = useDataStore.getState();
      expect(validationResults).toEqual(results);
    });

    it('should handle empty validationResults', () => {
      useDataStore.getState().setValidationResults([]);

      const { validationResults } = useDataStore.getState();
      expect(validationResults).toEqual([]);
    });

    it('should overwrite existing validationResults', () => {
      const firstResults: ValidationResult[] = [
        { column: 'a', type: 'number', stats: { count: 10, unique: 5 } },
      ];
      const secondResults: ValidationResult[] = [
        { column: 'b', type: 'string', stats: { count: 20, unique: 15 } },
      ];

      useDataStore.getState().setValidationResults(firstResults);
      useDataStore.getState().setValidationResults(secondResults);

      const { validationResults } = useDataStore.getState();
      expect(validationResults).toEqual(secondResults);
    });
  });  describe('clearData', () => {
    it('should reset all state to initial values', () => {
      // Set some data
      useDataStore.getState().setCsvData('test data');
      useDataStore.getState().setParsedData({
        columns: ['x'],
        rows: [{ x: '1' }],
        types: { x: 'number' },
      });
      useDataStore.getState().setColumnMapping({ x: 'a', y: 'b' });
      useDataStore.getState().setValidationResults([
        { column: 'x', type: 'number', stats: { count: 1, unique: 1 } },
      ]);

      // Clear all data
      useDataStore.getState().clearData();

      // Verify everything is reset
      const state = useDataStore.getState();
      expect(state.csvData).toBeNull();
      expect(state.parsedData).toBeNull();
      expect(state.columnMapping).toEqual({});
      expect(state.validationResults).toEqual([]);
    });

    it('should work when called on empty state', () => {
      useDataStore.getState().clearData();

      const state = useDataStore.getState();
      expect(state.csvData).toBeNull();
      expect(state.parsedData).toBeNull();
      expect(state.columnMapping).toEqual({});
      expect(state.validationResults).toEqual([]);
    });
  });

  describe('state isolation', () => {
    it('should not affect other state when updating csvData', () => {
      const initialParsedData: ParsedData = {
        columns: ['x'],
        rows: [{ x: '1' }],
        types: { x: 'number' },
      };
      useDataStore.getState().setParsedData(initialParsedData);

      useDataStore.getState().setCsvData('new data');

      const { parsedData } = useDataStore.getState();
      expect(parsedData).toEqual(initialParsedData);
    });

    it('should not affect other state when updating parsedData', () => {
      const initialMapping: ColumnMapping = { x: 'a', y: 'b' };
      useDataStore.getState().setColumnMapping(initialMapping);

      useDataStore.getState().setParsedData({
        columns: ['z'],
        rows: [{ z: '1' }],
        types: { z: 'number' },
      });

      const { columnMapping } = useDataStore.getState();
      expect(columnMapping).toEqual(initialMapping);
    });
  });

  describe('waypoint actions', () => {
    it('should add waypoint', () => {
      const waypoint: Waypoint = {
        id: 'waypoint-1',
        position: { x: 10, y: 10, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        annotation: 'First waypoint',
        timestamp: Date.now(),
      };

      useDataStore.getState().addWaypoint(waypoint);

      const { waypoints } = useDataStore.getState();
      expect(waypoints).toHaveLength(1);
      expect(waypoints[0]).toEqual(waypoint);
    });

    it('should add multiple waypoints', () => {
      const waypoint1: Waypoint = {
        id: 'waypoint-1',
        position: { x: 10, y: 10, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        annotation: 'First',
        timestamp: Date.now(),
      };
      const waypoint2: Waypoint = {
        id: 'waypoint-2',
        position: { x: 5, y: 5, z: 5 },
        target: { x: 1, y: 1, z: 1 },
        annotation: 'Second',
        timestamp: Date.now(),
      };

      useDataStore.getState().addWaypoint(waypoint1);
      useDataStore.getState().addWaypoint(waypoint2);

      const { waypoints } = useDataStore.getState();
      expect(waypoints).toHaveLength(2);
      expect(waypoints[0]).toEqual(waypoint1);
      expect(waypoints[1]).toEqual(waypoint2);
    });

    it('should update waypoint annotation', () => {
      const waypoint: Waypoint = {
        id: 'waypoint-1',
        position: { x: 10, y: 10, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        annotation: 'Original',
        timestamp: Date.now(),
      };

      useDataStore.getState().addWaypoint(waypoint);
      useDataStore.getState().updateWaypoint('waypoint-1', { annotation: 'Updated' });

      const { waypoints } = useDataStore.getState();
      expect(waypoints[0].annotation).toBe('Updated');
    });

    it('should update waypoint position', () => {
      const waypoint: Waypoint = {
        id: 'waypoint-1',
        position: { x: 10, y: 10, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        annotation: 'Test',
        timestamp: Date.now(),
      };

      useDataStore.getState().addWaypoint(waypoint);
      useDataStore.getState().updateWaypoint('waypoint-1', {
        position: { x: 5, y: 5, z: 5 }
      });

      const { waypoints } = useDataStore.getState();
      expect(waypoints[0].position).toEqual({ x: 5, y: 5, z: 5 });
    });

    it('should not update non-existent waypoint', () => {
      const waypoint: Waypoint = {
        id: 'waypoint-1',
        position: { x: 10, y: 10, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        annotation: 'Test',
        timestamp: Date.now(),
      };

      useDataStore.getState().addWaypoint(waypoint);
      useDataStore.getState().updateWaypoint('non-existent', { annotation: 'Updated' });

      const { waypoints } = useDataStore.getState();
      expect(waypoints[0].annotation).toBe('Test');
    });

    it('should delete waypoint by id', () => {
      const waypoint1: Waypoint = {
        id: 'waypoint-1',
        position: { x: 10, y: 10, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        annotation: 'First',
        timestamp: Date.now(),
      };
      const waypoint2: Waypoint = {
        id: 'waypoint-2',
        position: { x: 5, y: 5, z: 5 },
        target: { x: 1, y: 1, z: 1 },
        annotation: 'Second',
        timestamp: Date.now(),
      };

      useDataStore.getState().addWaypoint(waypoint1);
      useDataStore.getState().addWaypoint(waypoint2);
      useDataStore.getState().deleteWaypoint('waypoint-1');

      const { waypoints } = useDataStore.getState();
      expect(waypoints).toHaveLength(1);
      expect(waypoints[0].id).toBe('waypoint-2');
    });

    it('should handle deleting non-existent waypoint', () => {
      const waypoint: Waypoint = {
        id: 'waypoint-1',
        position: { x: 10, y: 10, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        annotation: 'Test',
        timestamp: Date.now(),
      };

      useDataStore.getState().addWaypoint(waypoint);
      useDataStore.getState().deleteWaypoint('non-existent');

      const { waypoints } = useDataStore.getState();
      expect(waypoints).toHaveLength(1);
    });

    it('should clear all waypoints', () => {
      const waypoint1: Waypoint = {
        id: 'waypoint-1',
        position: { x: 10, y: 10, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        annotation: 'First',
        timestamp: Date.now(),
      };
      const waypoint2: Waypoint = {
        id: 'waypoint-2',
        position: { x: 5, y: 5, z: 5 },
        target: { x: 1, y: 1, z: 1 },
        annotation: 'Second',
        timestamp: Date.now(),
      };

      useDataStore.getState().addWaypoint(waypoint1);
      useDataStore.getState().addWaypoint(waypoint2);
      useDataStore.getState().clearWaypoints();

      const { waypoints } = useDataStore.getState();
      expect(waypoints).toEqual([]);
    });

    it('should clear waypoints when clearData is called', () => {
      const waypoint: Waypoint = {
        id: 'waypoint-1',
        position: { x: 10, y: 10, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        annotation: 'Test',
        timestamp: Date.now(),
      };

      useDataStore.getState().addWaypoint(waypoint);
      useDataStore.getState().clearData();

      const { waypoints } = useDataStore.getState();
      expect(waypoints).toEqual([]);
    });
  });
});
