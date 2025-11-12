import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface BarProps {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
  data: Record<string, string | number>;
}

function Bar({ position, height, color, label, data }: BarProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* The bar */}
      <mesh
        position={[0, height / 2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial 
          color={hovered ? '#22d3ee' : color} 
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Tooltip on hover */}
      {hovered && (
        <Html position={[0, height + 0.5, 0]} center>
          <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl border border-cyan-500 text-sm whitespace-nowrap pointer-events-none">
            <div className="font-bold mb-1">{label}</div>
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="text-gray-300">
                {key}: {typeof value === 'number' ? value.toFixed(2) : value}
              </div>
            ))}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function BarChart3D() {
  const { parsedData, columnMapping } = useDataStore();

  if (!parsedData || !columnMapping.x || !columnMapping.y || !columnMapping.z) {
    return null;
  }

  // Extract column names
  const xCol = columnMapping.x;
  const yCol = columnMapping.y;
  const zCol = columnMapping.z;
  const colorCol = columnMapping.color;

  // Get data ranges for scaling
  const xValues = parsedData.rows.map(row => Number(row[xCol]) || 0);
  const yValues = parsedData.rows.map(row => Number(row[yCol]) || 0);
  const zValues = parsedData.rows.map(row => Number(row[zCol]) || 0);
  const colorValues = colorCol ? parsedData.rows.map(row => Number(row[colorCol]) || 0) : [];

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const zMin = Math.min(...zValues);
  const zMax = Math.max(...zValues);
  const colorMin = colorValues.length ? Math.min(...colorValues) : 0;
  const colorMax = colorValues.length ? Math.max(...colorValues) : 1;

  // Scale values to fit in scene (-10 to 10 range for X/Z, 0-10 for height)
  const scaleValue = (value: number, min: number, max: number, outputMin: number, outputMax: number) => {
    if (max === min) return outputMin;
    return ((value - min) / (max - min)) * (outputMax - outputMin) + outputMin;
  };

  // Color interpolation
  const getColor = (value: number) => {
    if (!colorCol) return '#06b6d4'; // Default cyan
    const normalized = (value - colorMin) / (colorMax - colorMin || 1);
    // Interpolate from cyan to purple
    return new THREE.Color().setHSL(0.5 + normalized * 0.3, 0.7, 0.6).getStyle();
  };

  // Generate bars
  const bars = parsedData.rows.slice(0, 100).map((row, idx) => {
    const xVal = Number(row[xCol]) || 0;
    const yVal = Number(row[yCol]) || 0;
    const zVal = Number(row[zCol]) || 0;
    const colorVal = colorCol ? (Number(row[colorCol]) || 0) : 0;

    const xPos = scaleValue(xVal, xMin, xMax, -10, 10);
    const zPos = scaleValue(zVal, zMin, zMax, -10, 10);
    const height = Math.max(0.5, scaleValue(yVal, yMin, yMax, 0.5, 10));

    const label = columnMapping.label ? String(row[columnMapping.label]) : `Point ${idx + 1}`;
    const color = getColor(colorVal);

    return (
      <Bar
        key={idx}
        position={[xPos, 0, zPos]}
        height={height}
        color={color}
        label={label}
        data={row}
      />
    );
  });

  return <group>{bars}</group>;
}
