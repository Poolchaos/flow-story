/*
 * Copyright (c) 2025 Phillip-Juan van der Berg. All Rights Reserved.
 *
 * This source code is licensed under the PolyForm Noncommercial License 1.0.0
 * found in the LICENSE file in the root directory of this source tree.
 *
 * For commercial licensing, contact: phillipjuanvanderberg@gmail.com
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ColumnMapper from './ColumnMapper';
import { useDataStore } from '../store/dataStore';
import type { ParsedData } from '../types';

describe('ColumnMapper', () => {
  const mockParsedData: ParsedData = {
    columns: ['name', 'age', 'salary', 'department'],
    rows: [
      { name: 'John', age: 30, salary: 50000, department: 'Engineering' },
      { name: 'Jane', age: 25, salary: 60000, department: 'Sales' },
    ],
    types: {
      name: 'string',
      age: 'number',
      salary: 'number',
      department: 'string',
    },
  };

  beforeEach(() => {
    useDataStore.getState().clearData();
  });

  describe('initial rendering', () => {
    it('should render heading', () => {
      useDataStore.getState().setParsedData(mockParsedData);
      render(<ColumnMapper />);

      expect(screen.getByText('Map Your Columns')).toBeInTheDocument();
    });

    it('should show message when no data available', () => {
      render(<ColumnMapper />);

      expect(screen.getByText('Please upload data first')).toBeInTheDocument();
    });

    it('should render required fields (X, Y, Z)', () => {
      useDataStore.getState().setParsedData(mockParsedData);
      render(<ColumnMapper />);

      expect(screen.getByText('X Axis')).toBeInTheDocument();
      expect(screen.getByText('Y Axis')).toBeInTheDocument();
      expect(screen.getByText('Z Axis')).toBeInTheDocument();
    });

    it('should render optional fields', () => {
      useDataStore.getState().setParsedData(mockParsedData);
      render(<ColumnMapper />);

      expect(screen.getByText('Color')).toBeInTheDocument();
      expect(screen.getByText('Size')).toBeInTheDocument();
      expect(screen.getByText('Label')).toBeInTheDocument();
    });
  });

  describe('column selection', () => {
    it('should update store when X axis selected', () => {
      useDataStore.getState().setParsedData(mockParsedData);
      render(<ColumnMapper />);

      const xSelect = screen.getAllByRole('combobox')[0];
      fireEvent.change(xSelect, { target: { value: 'age' } });

      const mapping = useDataStore.getState().columnMapping;
      expect(mapping.x).toBe('age');
    });

    it('should update store when Y axis selected', () => {
      useDataStore.getState().setParsedData(mockParsedData);
      render(<ColumnMapper />);

      const ySelect = screen.getAllByRole('combobox')[1];
      fireEvent.change(ySelect, { target: { value: 'salary' } });

      const mapping = useDataStore.getState().columnMapping;
      expect(mapping.y).toBe('salary');
    });

    it('should update store when Z axis selected', () => {
      useDataStore.getState().setParsedData(mockParsedData);
      render(<ColumnMapper />);

      const zSelect = screen.getAllByRole('combobox')[2];
      fireEvent.change(zSelect, { target: { value: 'age' } });

      const mapping = useDataStore.getState().columnMapping;
      expect(mapping.z).toBe('age');
    });

    it('should update store when optional color field selected', () => {
      useDataStore.getState().setParsedData(mockParsedData);
      render(<ColumnMapper />);

      const colorSelect = screen.getAllByRole('combobox')[3];
      fireEvent.change(colorSelect, { target: { value: 'department' } });

      const mapping = useDataStore.getState().columnMapping;
      expect(mapping.color).toBe('department');
    });

    it('should allow clearing optional mappings', () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({ x: 'age', y: 'salary', z: 'age', color: 'department' });
      render(<ColumnMapper />);

      const colorSelect = screen.getAllByRole('combobox')[3];
      fireEvent.change(colorSelect, { target: { value: '' } });

      const mapping = useDataStore.getState().columnMapping;
      expect(mapping.color).toBeUndefined();
    });
  });

  describe('validation messages', () => {
    it('should show warning when required axes not mapped', () => {
      useDataStore.getState().setParsedData(mockParsedData);
      render(<ColumnMapper />);

      expect(screen.getByText(/Please select X, Y, and Z axes/i)).toBeInTheDocument();
    });

    it('should show ready message when all required axes mapped', () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({ x: 'age', y: 'salary', z: 'age' });
      render(<ColumnMapper />);

      expect(screen.getByText(/Ready to validate/i)).toBeInTheDocument();
    });
  });

  describe('column type indicators', () => {
    it('should show column options in selects', () => {
      useDataStore.getState().setParsedData(mockParsedData);
      render(<ColumnMapper />);

      const selectElements = screen.getAllByRole('combobox');
      expect(selectElements.length).toBeGreaterThan(0);
    });

    it('should have default option selected', () => {
      useDataStore.getState().setParsedData(mockParsedData);
      render(<ColumnMapper />);

      const xSelect = screen.getAllByRole('combobox')[0];
      expect(xSelect).toHaveValue('');
    });
  });
});
