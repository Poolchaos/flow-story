import { useState } from 'react';

interface TimelineControlsProps {
  waypointCount: number;
  isPlaying: boolean;
  currentIndex: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSkipPrevious: () => void;
  onSkipNext: () => void;
  onDurationChange: (duration: number) => void;
}

export default function TimelineControls({
  waypointCount,
  isPlaying,
  currentIndex,
  duration,
  onPlay,
  onPause,
  onStop,
  onSkipPrevious,
  onSkipNext,
  onDurationChange,
}: TimelineControlsProps) {
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  const canPlay = waypointCount >= 2;
  const canSkipPrevious = currentIndex > 0;
  const canSkipNext = currentIndex < waypointCount - 1;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl px-6 py-4">
      <div className="flex items-center gap-4">
        {/* Skip Previous */}
        <button
          onClick={onSkipPrevious}
          disabled={!canSkipPrevious || isPlaying}
          className="p-2 text-cyan-400 hover:text-cyan-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          title="Previous waypoint"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* Play/Pause */}
        {!isPlaying ? (
          <button
            onClick={onPlay}
            disabled={!canPlay}
            className="p-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 text-white rounded-full disabled:cursor-not-allowed transition-colors shadow-lg"
            title={canPlay ? 'Play animation' : 'Add at least 2 waypoints'}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onPause}
            className="p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full transition-colors shadow-lg"
            title="Pause animation"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          </button>
        )}

        {/* Stop */}
        <button
          onClick={onStop}
          disabled={!isPlaying && currentIndex === 0}
          className="p-2 text-red-400 hover:text-red-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          title="Stop and reset"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
        </button>

        {/* Skip Next */}
        <button
          onClick={onSkipNext}
          disabled={!canSkipNext || isPlaying}
          className="p-2 text-cyan-400 hover:text-cyan-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          title="Next waypoint"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>

        <div className="w-px h-8 bg-gray-600 mx-2" />

        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-300">
            <span className="text-cyan-400 font-semibold">{currentIndex + 1}</span>
            <span className="text-gray-500 mx-1">/</span>
            <span>{waypointCount}</span>
          </div>

          {/* Duration control */}
          <div className="relative">
            <button
              onClick={() => setShowDurationPicker(!showDurationPicker)}
              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors flex items-center gap-2"
              title="Change transition duration"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {duration}s
            </button>

            {showDurationPicker && (
              <div className="absolute bottom-full mb-2 left-0 bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl w-48">
                <div className="text-xs text-gray-400 mb-2">Transition Duration</div>
                <div className="space-y-2">
                  {[2, 3, 4, 5].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        onDurationChange(d);
                        setShowDurationPicker(false);
                      }}
                      className={`w-full px-3 py-2 text-sm rounded transition-colors text-left ${
                        duration === d
                          ? 'bg-cyan-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {d} seconds
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!canPlay && (
        <div className="mt-3 pt-3 border-t border-gray-700 text-center text-sm text-gray-400">
          Add at least 2 waypoints to enable animation
        </div>
      )}
    </div>
  );
}
