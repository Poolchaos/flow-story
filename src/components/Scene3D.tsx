import { forwardRef, useRef, useImperativeHandle } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import { useDataStore } from '../store/dataStore';
import BarChart3D from './BarChart3D';
import ParticleCloud3D from './ParticleCloud3D';
import BubbleChart3D from './BubbleChart3D';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';

interface Scene3DProps {
  template?: 'bars' | 'particles' | 'spheres';
}

export interface Scene3DRef {
  getCameraState: () => { position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number } } | null;
}

const Scene3D = forwardRef<Scene3DRef, Scene3DProps>(({ template = 'bars' }, ref) => {
  const { parsedData, columnMapping } = useDataStore();
  const controlsRef = useRef<OrbitControlsType>(null);

  useImperativeHandle(ref, () => ({
    getCameraState: () => {
      if (!controlsRef.current) return null;

      const camera = controlsRef.current.object;
      const target = controlsRef.current.target;

      return {
        position: {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        },
        target: {
          x: target.x,
          y: target.y,
          z: target.z,
        },
      };
    },
  }));

  if (!parsedData || !columnMapping.x || !columnMapping.y || !columnMapping.z) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        <p className="text-xl">No data available. Please upload and configure your data first.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900">
      <Canvas>
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={60} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />

        {/* Controls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={50}
        />

        {/* Grid helper */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />

        {/* Data visualization */}
        {template === 'bars' && <BarChart3D />}
        {template === 'particles' && <ParticleCloud3D />}
        {template === 'spheres' && <BubbleChart3D />}
      </Canvas>
    </div>
  );
});

Scene3D.displayName = 'Scene3D';

export default Scene3D;
