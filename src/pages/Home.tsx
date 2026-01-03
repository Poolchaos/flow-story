/*
 * Copyright (c) 2025 Phillip-Juan van der Berg. All Rights Reserved.
 *
 * This source code is licensed under the PolyForm Noncommercial License 1.0.0
 * found in the LICENSE file in the root directory of this source tree.
 *
 * For commercial licensing, contact: phillipjuanvanderberg@gmail.com
 */

import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-800 py-24 md:py-32 lg:py-40 px-6 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-300 px-6 py-3 rounded-full mb-8 border border-cyan-400/30">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-lg font-medium">3D Data Storytelling Platform</span>
          </div>

          <h1 className="text-white text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1]">
            Transform Data into<br />Immersive 3D Narratives
          </h1>

          <p className="text-white/90 text-xl md:text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto leading-relaxed">
            Upload your CSV, map your columns, and watch your data come alive in stunning 3D visualizations with guided storytelling.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/create"
              className="bg-cyan-600 text-white px-12 py-5 rounded-xl text-xl md:text-2xl font-semibold hover:bg-cyan-700 transition-colors shadow-xl hover:shadow-2xl"
            >
              Create Your Story →
            </Link>
            <a
              href="#features"
              className="bg-white/10 text-white px-12 py-5 rounded-xl text-xl md:text-2xl font-semibold hover:bg-white/20 transition-colors border-2 border-white/30"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 px-6 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 text-gray-900 leading-tight">
            Data Storytelling Made Simple
          </h2>
          <p className="text-xl md:text-2xl text-center mb-20 text-gray-600 max-w-3xl mx-auto">
            From CSV to captivating 3D narrative in minutes
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            <div className="p-10 md:p-12 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Simple CSV Upload</h3>
              <p className="text-gray-600 leading-relaxed text-lg md:text-xl">Drag and drop your data file. We handle the rest.</p>
            </div>

            <div className="p-10 md:p-12 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path>
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">3D Templates</h3>
              <p className="text-gray-600 leading-relaxed text-lg md:text-xl">Choose from animated bars, particles, spheres, and more.</p>
            </div>

            <div className="p-10 md:p-12 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Interactive Narratives</h3>
              <p className="text-gray-600 leading-relaxed text-lg md:text-xl">Add waypoints to guide viewers through your data story.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-cyan-600 to-cyan-700 py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 text-white leading-tight">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-center mb-12 text-white/90 max-w-3xl mx-auto">
            Start creating immersive 3D narratives in minutes.
          </p>
          <div className="flex justify-center">
            <Link
              to="/create"
              className="bg-white text-cyan-700 px-12 py-5 rounded-xl text-xl md:text-2xl font-semibold hover:bg-gray-50 transition-colors shadow-xl hover:shadow-2xl"
            >
              Get Started Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-12 px-6 md:px-8">
        <div className="max-w-6xl mx-auto text-center text-base md:text-lg text-slate-400">
          <p>&copy; 2025 FlowStory. Part of the portfolio showcase.</p>
        </div>
      </footer>
    </div>
  );
}
