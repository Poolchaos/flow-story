/*
 * Copyright (c) 2025 Artemis. All Rights Reserved.
 *
 * This source code is licensed under the PolyForm Noncommercial License 1.0.0
 * found in the LICENSE file in the root directory of this source tree.
 *
 * For commercial licensing, contact: artemis@example.com
 */

import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import type { Waypoint } from '../types';

interface WaypointPanelProps {
  onCapture: () => { position: { x: number; y: number; z: number }; target: { x: number; y: number; z: number } } | null;
}

export default function WaypointPanel({ onCapture }: WaypointPanelProps) {
  const { waypoints, addWaypoint, updateWaypoint, deleteWaypoint, clearWaypoints } = useDataStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAnnotation, setEditAnnotation] = useState('');

  const handleCreateWaypoint = () => {
    const camera = onCapture();
    if (!camera) {
      alert('Unable to capture camera position. Please ensure 3D scene is loaded.');
      return;
    }

    const newWaypoint: Waypoint = {
      id: `waypoint-${Date.now()}`,
      position: camera.position,
      target: camera.target,
      annotation: `Waypoint ${waypoints.length + 1}`,
      timestamp: Date.now(),
    };

    addWaypoint(newWaypoint);
  };

  const handleStartEdit = (waypoint: Waypoint) => {
    setEditingId(waypoint.id);
    setEditAnnotation(waypoint.annotation);
  };

  const handleSaveEdit = (id: string) => {
    updateWaypoint(id, { annotation: editAnnotation });
    setEditingId(null);
    setEditAnnotation('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAnnotation('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this waypoint?')) {
      deleteWaypoint(id);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all waypoints?')) {
      clearWaypoints();
    }
  };

  return (
    <div className="absolute top-4 right-4 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Waypoints</h3>
        <div className="flex gap-2">
          {waypoints.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              title="Clear all waypoints"
            >
              Clear All
            </button>
          )}
          <button
            onClick={handleCreateWaypoint}
            className="px-3 py-1 text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors"
            title="Create waypoint at current camera position"
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
      </div>

      {waypoints.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm">No waypoints yet</p>
          <p className="text-xs mt-1">Click "Add" to capture current view</p>
        </div>
      ) : (
        <div className="space-y-2">
          {waypoints.map((waypoint, index) => (
            <div
              key={waypoint.id}
              className="bg-gray-700 rounded-lg p-3 border border-gray-600 hover:border-cyan-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-semibold text-sm">#{index + 1}</span>
                  {editingId === waypoint.id ? (
                    <input
                      type="text"
                      value={editAnnotation}
                      onChange={(e) => setEditAnnotation(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-cyan-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(waypoint.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">{waypoint.annotation}</span>
                  )}
                </div>
                <div className="flex gap-1">
                  {editingId === waypoint.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(waypoint.id)}
                        className="p-1 text-green-400 hover:text-green-300 transition-colors"
                        title="Save"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                        title="Cancel"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartEdit(waypoint)}
                        className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                        title="Edit annotation"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(waypoint.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete waypoint"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Position:</span>
                  <span className="font-mono">
                    ({waypoint.position.x.toFixed(1)}, {waypoint.position.y.toFixed(1)}, {waypoint.position.z.toFixed(1)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Target:</span>
                  <span className="font-mono">
                    ({waypoint.target.x.toFixed(1)}, {waypoint.target.y.toFixed(1)}, {waypoint.target.z.toFixed(1)})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {waypoints.length > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            {waypoints.length} waypoints • Animation ready
          </p>
        </div>
      )}
    </div>
  );
}
