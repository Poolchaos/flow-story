import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import type { Waypoint } from '../types';

interface CameraAnimatorProps {
  waypoints: Waypoint[];
  isPlaying: boolean;
  currentIndex: number;
  duration: number;
  onComplete: () => void;
  onIndexChange: (index: number) => void;
  controlsRef: React.RefObject<OrbitControlsType | null>;
}

// Easing function for smooth camera movement
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export default function CameraAnimator({
  waypoints,
  isPlaying,
  currentIndex,
  duration,
  onComplete,
  onIndexChange,
  controlsRef,
}: CameraAnimatorProps) {
  const progressRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isPlaying) {
      progressRef.current = 0;
      startTimeRef.current = Date.now();
    }
  }, [isPlaying, currentIndex]);

  useFrame(() => {
    if (!isPlaying || !controlsRef.current || waypoints.length < 2) return;

    const now = Date.now();
    const elapsed = (now - startTimeRef.current) / 1000; // Convert to seconds
    const progress = Math.min(elapsed / duration, 1);
    progressRef.current = progress;

    if (progress >= 1) {
      // Move to next waypoint
      if (currentIndex < waypoints.length - 1) {
        onIndexChange(currentIndex + 1);
        startTimeRef.current = now;
      } else {
        // Animation complete
        onComplete();
      }
      return;
    }

    // Get current and next waypoint
    const current = waypoints[currentIndex];
    const next = waypoints[currentIndex + 1];

    if (!current || !next) return;

    // Apply easing
    const easedProgress = easeInOutCubic(progress);

    // Interpolate camera position
    const startPos = new Vector3(current.position.x, current.position.y, current.position.z);
    const endPos = new Vector3(next.position.x, next.position.y, next.position.z);
    const newPos = startPos.lerp(endPos, easedProgress);

    // Interpolate target position
    const startTarget = new Vector3(current.target.x, current.target.y, current.target.z);
    const endTarget = new Vector3(next.target.x, next.target.y, next.target.z);
    const newTarget = startTarget.lerp(endTarget, easedProgress);

    // Update camera and controls
    const camera = controlsRef.current.object;
    camera.position.copy(newPos);
    controlsRef.current.target.copy(newTarget);
    controlsRef.current.update();
  });

  return null; // This component only handles animation logic
}
