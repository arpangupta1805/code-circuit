import { useState, useEffect } from 'react';
import { TripProvider } from './context/TripContext';
import TripSidebar from './components/TripSidebar';
import TripBoard from './components/TripBoard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MoonIcon, SunIcon, GlobeAltIcon, Bars3Icon } from '@heroicons/react/24/outline';
import './animations.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Default to light theme
    return false;
  });
  
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Apply theme class to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <TripProvider>
      <div className={`h-screen w-full flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
        {/* Top navigation bar */}
        <header className={`${darkMode ? 'bg-gray-800 shadow-gray-700/20' : 'bg-white shadow-blue-200/60'} shadow-lg z-10 transition-colors duration-300`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                {isMobile && (
                  <button 
                    onClick={toggleSidebar}
                    className="mr-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </button>
                )}
                <div className="flex-shrink-0 flex items-center animate-pulse-slow">
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-9 w-9 ${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping-slow"></div>
                  </div>
                  <h1 className={`ml-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Wanderlust</h1>
                </div>
                <div className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-blue-600'} transition-colors duration-300 flex items-center`}>
                  <span className="hidden sm:inline">Interactive Itinerary Board</span>
                  <span className="sm:hidden">Itinerary</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-100'} px-3 py-1 rounded-full transition-colors duration-300 hidden sm:flex items-center`}>
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Travel Smarter</span>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 shadow-inner' 
                      : 'bg-blue-100 hover:bg-blue-200 shadow'
                  }`}
                  title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? (
                    <SunIcon className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <MoonIcon className="h-5 w-5 text-blue-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {showSidebar && <TripSidebar onClose={isMobile ? toggleSidebar : undefined} />}
          <main className={`flex-1 overflow-y-auto p-4 ${
            darkMode ? '' : 'bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30'
          }`}>
            <TripBoard />
          </main>
        </div>
        
        {/* Toast notifications */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? 'dark' : 'light'}
        />
      </div>
    </TripProvider>
  );
}

export default App;
