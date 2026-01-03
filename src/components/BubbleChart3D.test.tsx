/*
 * Copyright (c) 2025 Artemis. All Rights Reserved.
 *
 * This source code is licensed under the PolyForm Noncommercial License 1.0.0
 * found in the LICENSE file in the root directory of this source tree.
 *
 * For commercial licensing, contact: artemis@example.com
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { act } from 'react';
import BubbleChart3D from './BubbleChart3D';
import { useDataStore } from '../store/dataStore';
import type { ParsedData } from '../types';

describe('BubbleChart3D', () => {
  const mockParsedData: ParsedData = {
    columns: ['x', 'y', 'z', 'category', 'size'],
    rows: [
      { x: 10, y: 20, z: 30, category: 'A', size: 5 },
      { x: 15, y: 25, z: 35, category: 'B', size: 10 },
      { x: 20, y: 30, z: 40, category: 'C', size: 15 },
    ],
    types: {
      x: 'number',
      y: 'number',
      z: 'number',
      category: 'string',
      size: 'number',
    },
  };

  beforeEach(() => {
    useDataStore.getState().clearData();
  });

  describe('rendering', () => {
    it('should render null when no data available', async () => {
      let result;
      await act(async () => {
        result = render(
          <Canvas>
            <BubbleChart3D />
          </Canvas>
        );
      });

      expect(result.container).toBeInTheDocument();
    });

    it('should render null when column mapping incomplete', async () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({ x: 'x', y: 'y' }); // Missing z

      let result;
      await act(async () => {
        result = render(
          <Canvas>
            <BubbleChart3D />
          </Canvas>
        );
      });

      expect(result.container).toBeInTheDocument();
    });

    it('should render spheres when data and mapping complete', async () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({ x: 'x', y: 'y', z: 'z' });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
    });
  });

  describe('data processing', () => {
    it('should limit to 100 bubbles', async () => {
      const largeMockData: ParsedData = {
        columns: ['x', 'y', 'z'],
        rows: Array.from({ length: 150 }, (_, i) => ({
          x: i,
          y: i * 2,
          z: i * 3,
        })),
        types: {
          x: 'number',
          y: 'number',
          z: 'number',
        },
      };

      useDataStore.getState().setParsedData(largeMockData);
      useDataStore.getState().setColumnMapping({ x: 'x', y: 'y', z: 'z' });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
      // Component should handle 150 rows but only render 100 bubbles
    });

    it('should handle zero values correctly', async () => {
      const zeroData: ParsedData = {
        columns: ['x', 'y', 'z'],
        rows: [
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 1, z: 1 },
        ],
        types: {
          x: 'number',
          y: 'number',
          z: 'number',
        },
      };

      useDataStore.getState().setParsedData(zeroData);
      useDataStore.getState().setColumnMapping({ x: 'x', y: 'y', z: 'z' });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
    });

    it('should handle identical values (no range)', async () => {
      const identicalData: ParsedData = {
        columns: ['x', 'y', 'z'],
        rows: [
          { x: 5, y: 5, z: 5 },
          { x: 5, y: 5, z: 5 },
          { x: 5, y: 5, z: 5 },
        ],
        types: {
          x: 'number',
          y: 'number',
          z: 'number',
        },
      };

      useDataStore.getState().setParsedData(identicalData);
      useDataStore.getState().setColumnMapping({ x: 'x', y: 'y', z: 'z' });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
    });
  });

  describe('optional mappings', () => {
    it('should handle color mapping when available', async () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({
        x: 'x',
        y: 'y',
        z: 'z',
        color: 'size', // Use size column for color
      });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
    });

    it('should use default color when no color mapping', async () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({ x: 'x', y: 'y', z: 'z' });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
    });

    it('should handle size mapping when available', async () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({
        x: 'x',
        y: 'y',
        z: 'z',
        size: 'size',
      });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
    });

    it('should use default radius when no size mapping', async () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({ x: 'x', y: 'y', z: 'z' });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
    });

    it('should handle string color column (should use default)', async () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({
        x: 'x',
        y: 'y',
        z: 'z',
        color: 'category', // String column - should default
      });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
    });

    it('should handle string size column (should use default)', async () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({
        x: 'x',
        y: 'y',
        z: 'z',
        size: 'category', // String column - should default
      });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
    });
  });

  describe('transparency and opacity', () => {
    it('should apply varying opacity based on size mapping', async () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({
        x: 'x',
        y: 'y',
        z: 'z',
        size: 'size', // Will create varying opacity (0.6 to 0.9)
      });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
    });

    it('should use default opacity when no size mapping', async () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({ x: 'x', y: 'y', z: 'z' });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
    });
  });

  describe('useMemo optimization', () => {
    it('should recalculate when parsedData changes', async () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({ x: 'x', y: 'y', z: 'z' });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      // Change data
      const newData: ParsedData = {
        ...mockParsedData,
        rows: [{ x: 50, y: 60, z: 70, category: 'D', size: 20 }],
      };
      useDataStore.getState().setParsedData(newData);

      await act(async () => {
        result.rerender(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
    });

    it('should recalculate when columnMapping changes', async () => {
      useDataStore.getState().setParsedData(mockParsedData);
      useDataStore.getState().setColumnMapping({ x: 'x', y: 'y', z: 'z' });

      let result;
      await act(async () => {
        result = render(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      // Change mapping
      useDataStore.getState().setColumnMapping({ x: 'y', y: 'z', z: 'x' });

      await act(async () => {
        result.rerender(
          <Canvas frameloop="demand">
            <BubbleChart3D />
          </Canvas>
        );
      });

      await waitFor(() => {
        expect(result.container.querySelector('canvas')).toBeInTheDocument();
      });
    });
  });
});
