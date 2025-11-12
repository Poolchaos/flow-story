import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Create from './pages/Create';
import Explore from './pages/Explore';
import Visualize from './pages/Visualize';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-cyan-600 transition-colors">
              FlowStory
            </Link>
            <div className="flex gap-6">
              <Link to="/" className="text-lg font-medium text-gray-700 hover:text-cyan-600 transition-colors">
                Home
              </Link>
              <Link to="/create" className="text-lg font-medium text-gray-700 hover:text-cyan-600 transition-colors">
                Create
              </Link>
              <Link to="/explore" className="text-lg font-medium text-gray-700 hover:text-cyan-600 transition-colors">
                Explore
              </Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/visualize" element={<Visualize />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

