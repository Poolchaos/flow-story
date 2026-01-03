/*
 * Copyright (c) 2025 Artemis. All Rights Reserved.
 *
 * This source code is licensed under the PolyForm Noncommercial License 1.0.0
 * found in the LICENSE file in the root directory of this source tree.
 *
 * For commercial licensing, contact: artemis@example.com
 */

import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';
import Scene3D, { type Scene3DRef } from '../components/Scene3D';
import WaypointPanel from '../components/WaypointPanel';
import TimelineControls from '../components/TimelineControls';
import type { Template } from '../types';

export default function Visualize() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('bars');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(3);
  const sceneRef = useRef<Scene3DRef>(null);
  const { parsedData, columnMapping, waypoints } = useDataStore();

  const hasData = parsedData && columnMapping.x && columnMapping.y && columnMapping.z;

  const handleCaptureCamera = () => {
    if (!sceneRef.current) return null;
    return sceneRef.current.getCameraState();
  };

  const handlePlay = () => {
    if (waypoints.length >= 2) {
      setIsAnimating(true);
      setCurrentWaypointIndex(0);
    }
  };

  const handlePause = () => {
    setIsAnimating(false);
  };

  const handleStop = () => {
    setIsAnimating(false);
    setCurrentWaypointIndex(0);
  };

  const handleSkipPrevious = () => {
    if (currentWaypointIndex > 0) {
      setCurrentWaypointIndex(currentWaypointIndex - 1);
    }
  };

  const handleSkipNext = () => {
    if (currentWaypointIndex < waypoints.length - 1) {
      setCurrentWaypointIndex(currentWaypointIndex + 1);
    }
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  const handleWaypointIndexChange = (index: number) => {
    setCurrentWaypointIndex(index);
  };

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
        <div className="text-center">
          <svg className="w-20 h-20 mx-auto mb-6 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <h1 className="text-3xl font-bold text-white mb-4">No Data Available</h1>
          <p className="text-xl text-gray-400 mb-8">
            Please upload and configure your data before visualizing
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Go to Create
          </Link>
        </div>
      </div>
    );
  }

  const templates = [
    {
      id: 'bars' as Template,
      name: 'Bar Chart',
      description: 'Vertical bars in 3D space',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'particles' as Template,
      name: 'Particles',
      description: 'Scatter plot cloud',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
      )
    },
    {
      id: 'spheres' as Template,
      name: 'Bubbles',
      description: 'Sized spheres',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" opacity="0.3" />
          <circle cx="12" cy="12" r="6" />
        </svg>
      )
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/create"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Edit</span>
          </Link>
          <div className="w-px h-6 bg-gray-600" />
          <h1 className="text-xl font-bold text-white">3D Visualization</h1>
        </div>

        {/* Template Selector */}
        <div className="flex gap-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${
                  selectedTemplate === template.id
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
              title={template.description}
            >
              {template.icon}
              <span className="hidden md:inline">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3D Scene */}
      <div className="flex-1 relative">
        <Scene3D
          ref={sceneRef}
          template={selectedTemplate}
          isAnimating={isAnimating}
          currentWaypointIndex={currentWaypointIndex}
          animationDuration={animationDuration}
          onAnimationComplete={handleAnimationComplete}
          onWaypointIndexChange={handleWaypointIndexChange}
        />

        {/* Waypoint Panel */}
        <WaypointPanel onCapture={handleCaptureCamera} />

        {/* Timeline Controls */}
        {waypoints.length > 0 && (
          <TimelineControls
            waypointCount={waypoints.length}
            isPlaying={isAnimating}
            currentIndex={currentWaypointIndex}
            duration={animationDuration}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onSkipPrevious={handleSkipPrevious}
            onSkipNext={handleSkipNext}
            onDurationChange={setAnimationDuration}
          />
        )}

        {/* Instructions overlay */}
        <div className="absolute bottom-6 left-6 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-300">
          <div className="font-semibold text-white mb-2">Controls:</div>
          <div className="space-y-1">
            <div>Left click + drag: Rotate</div>
            <div>Right click + drag: Pan</div>
            <div>Scroll: Zoom</div>
            <div>Hover: Show data</div>
          </div>
        </div>

        {/* Data info */}
        <div className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-300">
          <div className="font-semibold text-white mb-2">Data Mapping:</div>
          <div className="space-y-1">
            <div>X-axis: {columnMapping.x}</div>
            <div>Y-axis: {columnMapping.y}</div>
            <div>Z-axis: {columnMapping.z}</div>
            {columnMapping.color && <div>Color: {columnMapping.color}</div>}
            {columnMapping.size && <div>Size: {columnMapping.size}</div>}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700 text-gray-400">
            {parsedData.rows.length} data points
            {parsedData.rows.length > 100 && ' (showing first 100)'}
          </div>
        </div>
      </div>
    </div>
  );
}
