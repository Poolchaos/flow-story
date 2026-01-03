/*
 * Copyright (c) 2025 Artemis. All Rights Reserved.
 *
 * This source code is licensed under the PolyForm Noncommercial License 1.0.0
 * found in the LICENSE file in the root directory of this source tree.
 *
 * For commercial licensing, contact: artemis@example.com
 */

import { useMemo } from 'react';
import { useDataStore } from '../store/dataStore';
import * as THREE from 'three';

export default function ParticleCloud3D() {
  const { parsedData, columnMapping } = useDataStore();

  const particlesData = useMemo(() => {
    if (!parsedData || !columnMapping.x || !columnMapping.y || !columnMapping.z) {
      return null;
    }

    const { rows, types } = parsedData;
    const limitedRows = rows.slice(0, 100); // Limit to 100 points for performance

    // Get mapped columns
    const xCol = columnMapping.x;
    const yCol = columnMapping.y;
    const zCol = columnMapping.z;
    const colorCol = columnMapping.color;
    const sizeCol = columnMapping.size;

    // Extract values
    const xValues = limitedRows.map((row) => Number(row[xCol]) || 0);
    const yValues = limitedRows.map((row) => Number(row[yCol]) || 0);
    const zValues = limitedRows.map((row) => Number(row[zCol]) || 0);

    // Calculate ranges for scaling
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const zMin = Math.min(...zValues);
    const zMax = Math.max(...zValues);

    // Scale function
    const scaleValue = (value: number, min: number, max: number, outMin: number, outMax: number) => {
      if (max === min) return (outMin + outMax) / 2;
      return ((value - min) / (max - min)) * (outMax - outMin) + outMin;
    };

    // Prepare positions array
    const positions = new Float32Array(limitedRows.length * 3);
    const colors = new Float32Array(limitedRows.length * 3);
    const sizes = new Float32Array(limitedRows.length);

    // Color values for interpolation
    let colorValues: number[] = [];
    if (colorCol && types[colorCol] === 'number') {
      colorValues = limitedRows.map((row) => Number(row[colorCol]) || 0);
    }
    const colorMin = colorValues.length > 0 ? Math.min(...colorValues) : 0;
    const colorMax = colorValues.length > 0 ? Math.max(...colorValues) : 1;

    // Size values
    let sizeValues: number[] = [];
    if (sizeCol && types[sizeCol] === 'number') {
      sizeValues = limitedRows.map((row) => Number(row[sizeCol]) || 0);
    }
    const sizeMin = sizeValues.length > 0 ? Math.min(...sizeValues) : 0;
    const sizeMax = sizeValues.length > 0 ? Math.max(...sizeValues) : 1;

    limitedRows.forEach((_row, i) => {
      // Position
      const x = scaleValue(xValues[i], xMin, xMax, -10, 10);
      const y = scaleValue(yValues[i], yMin, yMax, -10, 10);
      const z = scaleValue(zValues[i], zMin, zMax, -10, 10);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color (interpolate between cyan and purple)
      if (colorValues.length > 0) {
        const t = scaleValue(colorValues[i], colorMin, colorMax, 0, 1);
        const color = new THREE.Color();
        color.setHSL(0.5 + t * 0.3, 0.8, 0.6); // Cyan to purple gradient
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      } else {
        // Default cyan color
        const color = new THREE.Color('#06b6d4');
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      // Size
      if (sizeValues.length > 0) {
        sizes[i] = scaleValue(sizeValues[i], sizeMin, sizeMax, 0.5, 2.0);
      } else {
        sizes[i] = 1.0;
      }
    });

    return { positions, colors, sizes, count: limitedRows.length };
  }, [parsedData, columnMapping]);

  if (!particlesData) {
    return null;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesData.positions, 3]}
          count={particlesData.count}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particlesData.colors, 3]}
          count={particlesData.count}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[particlesData.sizes, 1]}
          count={particlesData.count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}
