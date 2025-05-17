import { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import NewTripForm from './NewTripForm';

const TripSidebar = ({ onClose }) => {
  const { trips, currentTripId, setCurrentTripId, deleteTrip } = useTrip();
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleTripSelect = (tripId) => {
    setCurrentTripId(tripId);
    // Close sidebar on mobile when a trip is selected
    if (onClose) {
      onClose();
    }
  };
  
  const handleDeleteTrip = (e, tripId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(tripId);
    }
  };
  
  return (
    <>
      <div 
        // className={`h-full bg-gradient-to-br bg-gradient-to-br from-indigo-100 via-sky-100 to-lime-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 shadow-md z-20 transition-all duration-300 flex flex-col ${
        className={`h-full bg-gradient-to-br from-teal-100 via-emerald-50 to-amber-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 shadow-md z-20 transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-[6vw]' : 'w-64'
        } ${onClose ? 'absolute left-0 top-16 bottom-0' : ''}`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          {!isCollapsed && (
            <h2 className="text-lg font-bold text-black dark:text-white">My Trips</h2>
          )}
          <div className={`flex ${isCollapsed ? 'w-full justify-center' : ''}`}>
            {!isCollapsed && (
              <button
                onClick={() => setIsCreatingTrip(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2"
                title="Create new trip"
              >
                <PlusIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </button>
            )}
            
            {onClose ? (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Close sidebar"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            ) : (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {trips.length === 0 ? (
            <div className="text-center p-4 text-gray-500 dark:text-gray-400">
              {!isCollapsed && "No trips yet. Create your first trip!"}
              {isCollapsed && <GlobeAltIcon className="w-6 h-6 mx-auto" />}
            </div>
          ) : (
            <ul className="space-y-1">
              {trips.map(trip => (
                <li 
                  key={trip.id}
                  className={`rounded-lg cursor-pointer transition-all duration-200 ${
                    trip.id === currentTripId 
                      ? 'bg-blue-50 dark:bg-blue-900/30 shadow-sm' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleTripSelect(trip.id)}
                >
                  <div className="p-3 flex items-center justify-between">
                    <div className={`flex items-center overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
                      <div className={`flex-shrink-0 ${!isCollapsed ? 'mr-3' : ''}`}>
                        <div className={`w-8 h-8 rounded-full ${
                          trip.id === currentTripId
                            ? 'bg-blue-100 dark:bg-blue-900 shadow-inner'
                            : 'bg-gray-100 dark:bg-gray-700'
                        } flex items-center justify-center`}>
                          <GlobeAltIcon className={`w-4 h-4 ${
                            trip.id === currentTripId
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`} />
                        </div>
                      </div>
                      {!isCollapsed && (
                        <div className="truncate">
                          <div className={`font-medium truncate ${
                            trip.id === currentTripId
                              ? 'text-blue-700 dark:text-blue-400'
                              : 'text-gray-800 dark:text-white'
                          }`}>
                            {trip.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {trip.destination}
                          </div>
                        </div>
                      )}
                    </div>
                    {!isCollapsed && trip.id === currentTripId && (
                      <button
                        onClick={(e) => handleDeleteTrip(e, trip.id)}
                        className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 transition-colors"
                        title="Delete trip"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            
          )}
        </div>
        
        {isCollapsed && (
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsCreatingTrip(true)}
              className="w-full p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <div className="relative group">
                <PlusIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className='absolute bottom-full mb-1 left-1/2 -translate-x-[-0.8vw] w-[70px] bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-left'>
                 New Trip
                </span>
              </div>
            </button>
          </div>
        )}
        <div className="text-gray-400 p-3 text-center text-sm flex justify-center items-center gap-2">
          {!isCollapsed && (
            <span>Drag and Drop Activity cards to reschedule.</span>
          )}
        </div>
      </div>
      
      {/* Dark overlay for mobile */}
      {onClose && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={onClose}
        />
      )}
      
      {isCreatingTrip && (
        <NewTripForm onClose={() => setIsCreatingTrip(false)} />
      )}
    </>
  );
};

export default TripSidebar; 