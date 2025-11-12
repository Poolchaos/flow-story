import { useMemo } from 'react';
import { useDataStore } from '../store/dataStore';
import * as THREE from 'three';

export default function BubbleChart3D() {
  const { parsedData, columnMapping } = useDataStore();

  const bubblesData = useMemo(() => {
    if (!parsedData || !columnMapping.x || !columnMapping.y || !columnMapping.z) {
      return null;
    }

    const { rows, types } = parsedData;
    const limitedRows = rows.slice(0, 100); // Limit to 100 bubbles for performance

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

    // Color values for interpolation
    let colorValues: number[] = [];
    if (colorCol && types[colorCol] === 'number') {
      colorValues = limitedRows.map((row) => Number(row[colorCol]) || 0);
    }
    const colorMin = colorValues.length > 0 ? Math.min(...colorValues) : 0;
    const colorMax = colorValues.length > 0 ? Math.max(...colorValues) : 1;

    // Size values for radius scaling
    let sizeValues: number[] = [];
    if (sizeCol && types[sizeCol] === 'number') {
      sizeValues = limitedRows.map((row) => Number(row[sizeCol]) || 0);
    }
    const sizeMin = sizeValues.length > 0 ? Math.min(...sizeValues) : 0;
    const sizeMax = sizeValues.length > 0 ? Math.max(...sizeValues) : 1;

    // Create bubble data array
    const bubbles = limitedRows.map((_row, i) => {
      // Position
      const x = scaleValue(xValues[i], xMin, xMax, -10, 10);
      const y = scaleValue(yValues[i], yMin, yMax, -10, 10);
      const z = scaleValue(zValues[i], zMin, zMax, -10, 10);

      // Color (interpolate between cyan and purple)
      let color: string;
      if (colorValues.length > 0) {
        const t = scaleValue(colorValues[i], colorMin, colorMax, 0, 1);
        const colorObj = new THREE.Color();
        colorObj.setHSL(0.5 + t * 0.3, 0.8, 0.6); // Cyan to purple gradient
        color = '#' + colorObj.getHexString();
      } else {
        // Default cyan color
        color = '#06b6d4';
      }

      // Radius (scale between 0.2 and 2.0)
      let radius: number;
      if (sizeValues.length > 0) {
        radius = scaleValue(sizeValues[i], sizeMin, sizeMax, 0.2, 2.0);
      } else {
        radius = 0.5; // Default radius
      }

      // Opacity based on size (larger bubbles more opaque for better visibility)
      const opacity = sizeValues.length > 0
        ? scaleValue(sizeValues[i], sizeMin, sizeMax, 0.6, 0.9)
        : 0.7;

      return { x, y, z, color, radius, opacity };
    });

    return bubbles;
  }, [parsedData, columnMapping]);

  if (!bubblesData) {
    return null;
  }

  return (
    <group>
      {bubblesData.map((bubble, i) => (
        <mesh key={i} position={[bubble.x, bubble.y, bubble.z]}>
          <sphereGeometry args={[bubble.radius, 32, 32]} />
          <meshStandardMaterial
            color={bubble.color}
            transparent
            opacity={bubble.opacity}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
