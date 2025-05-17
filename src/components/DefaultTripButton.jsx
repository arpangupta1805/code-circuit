import { LightBulbIcon } from '@heroicons/react/24/outline';
import { useTrip } from '../context/TripContext';
import { showToast } from './CustomToast';

const DefaultTripButton = ({ isCollapsed }) => {
  const { loadDefaultTrip } = useTrip();
  
  const handleLoadDefault = () => {
    loadDefaultTrip();
    showToast(
      'Default Trip Loaded',
      'A sample trip to Paris has been loaded for you to explore.',
      'success'
    );
  };
  
  return (
    <button
      onClick={handleLoadDefault}
      className={`group relative ${
        isCollapsed 
          ? 'w-full p-2 flex justify-center'
          : 'w-full p-2 flex items-center gap-2'
      } rounded-lg bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 hover:from-amber-200 hover:to-amber-300 dark:hover:from-amber-800/50 dark:hover:to-amber-700/50 text-amber-800 dark:text-amber-300 transition-all duration-300 shadow-sm`}
      title="Load example trip"
    >
      <div className="relative">
        <LightBulbIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-2'}`} />
        {isCollapsed && (
          <span className='absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-[100px] bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'>
            Load Example Trip
          </span>
        )}
      </div>
      {!isCollapsed && (
        <span className="text-sm font-medium">Load Example Trip</span>
      )}
    </button>
  );
};

export default DefaultTripButton; 