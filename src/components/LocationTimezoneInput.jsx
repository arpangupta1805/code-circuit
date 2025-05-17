import { useState } from 'react';
import { MapPinIcon, GlobeAltIcon, HomeIcon, ClockIcon } from '@heroicons/react/24/outline';

const LocationTimezoneInput = ({ location, timezone, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleLocationChange = (e) => {
    onChange('location', e.target.value);
  };
  
  const handleTimezoneChange = (value) => {
    onChange('timezone', value);
  };
  
  // Get icon based on selected timezone
  const getTimezoneIcon = () => {
    switch (timezone) {
      case 'destination':
        return <GlobeAltIcon className="w-5 h-5 text-blue-500" />;
      case 'home':
        return <HomeIcon className="w-5 h-5 text-green-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };
  
  // Get label based on selected timezone
  const getTimezoneLabel = () => {
    switch (timezone) {
      case 'destination':
        return 'Destination Time';
      case 'home':
        return 'Home Time';
      default:
        return 'Local Time';
    }
  };
  
  return (
    <div className="mb-3">
      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Location & Timezone</label>
      
      <div className="relative">
        <div className="flex items-center border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
          <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700">
            <MapPinIcon className="w-5 h-5 text-red-500" />
          </div>
          
          <input
            type="text"
            value={location || ''}
            onChange={handleLocationChange}
            placeholder="Enter location"
            className="flex-grow p-2 border-none focus:outline-none dark:bg-gray-800 dark:text-white"
          />
          
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {getTimezoneIcon()}
            <span className="text-xs hidden sm:inline">{getTimezoneLabel()}</span>
          </button>
        </div>
        
        {/* Timezone selector dropdown */}
        {isExpanded && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-1">
              <button
                type="button"
                onClick={() => {
                  handleTimezoneChange('local');
                  setIsExpanded(false);
                }}
                className={`w-full flex items-center gap-2 p-2 rounded-md text-left ${
                  timezone === 'local' ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <ClockIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Local Time</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Time at the activity location</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  handleTimezoneChange('destination');
                  setIsExpanded(false);
                }}
                className={`w-full flex items-center gap-2 p-2 rounded-md text-left ${
                  timezone === 'destination' ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <GlobeAltIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium">Destination Time</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Time at your trip destination</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  handleTimezoneChange('home');
                  setIsExpanded(false);
                }}
                className={`w-full flex items-center gap-2 p-2 rounded-md text-left ${
                  timezone === 'home' ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <HomeIcon className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-medium">Home Time</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Time at your home location</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationTimezoneInput; 