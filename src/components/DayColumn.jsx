import { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import ActivityCard from './ActivityCard';
import { useTrip } from '../context/TripContext';
import { 
  PlusIcon, 
  TrashIcon, 
  SunIcon, 
  MoonIcon, 
  CloudIcon,
  PlusCircleIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import { useLayoutEffect } from 'react';
import LocationTimezoneInput from './LocationTimezoneInput';
import { showConfirmToast } from './CustomToast';

const DayColumn = ({ day, index }) => {
  const { removeDay, addActivity, formatDayDate } = useTrip();
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    time: '12:00',
    category: 'activity',
    notes: '',
    isCompleted: false,
    location: '',
    timezone: 'local',
  });
  
  const handleAddActivityToggle = () => {
    setIsAddingActivity(!isAddingActivity);
    setNewActivity({
      title: '',
      time: '12:00',
      category: 'activity',
      notes: '',
      isCompleted: false,
      location: '',
      timezone: 'local',
    });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLocationTimezoneChange = (field, value) => {
    setNewActivity(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAddActivity = () => {
    // Only add if title is not empty
    if (newActivity.title.trim() !== '') {
      addActivity(day.id, newActivity);
      handleAddActivityToggle();
    }
  };
  
  const handleDeleteDay = () => {
    showConfirmToast(
      'Delete Day',
      `Are you sure you want to delete ${formatDayDate(day.date)}?`,
      () => removeDay(day.id),
      null
    );
  };
  
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // For future weather feature - just random mock data for now
  const getWeatherInfo = () => {
    const weatherTypes = ['sunny', 'cloudy', 'clear-night'];
    const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    
    switch (randomWeather) {
      case 'sunny':
        return { icon: <SunIcon className="w-5 h-5" />, temp: `${Math.floor(Math.random() * 15) + 20}°C`, color: 'text-yellow-500' };
      case 'cloudy':
        return { icon: <CloudIcon className="w-5 h-5" />, temp: `${Math.floor(Math.random() * 10) + 15}°C`, color: 'text-gray-500' };
      case 'clear-night':
        return { icon: <MoonIcon className="w-5 h-5" />, temp: `${Math.floor(Math.random() * 10) + 10}°C`, color: 'text-blue-500' };
      default:
        return { icon: <SunIcon className="w-5 h-5" />, temp: `${Math.floor(Math.random() * 15) + 20}°C`, color: 'text-yellow-500' };
    }
  };


const weather = getWeatherInfo();
  useLayoutEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <Draggable draggableId={`day-${day.id}`} index={index} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-800 dark:to-gray-900 dark:border dark:border-gray-700/50 w-96 h-full rounded-2xl shadow-card flex flex-col transition-all duration-300 ${
            snapshot.isDragging ? 'scale-[1.02] shadow-lg z-50' : ''
          } ${isDragging ? 'opacity-90' : ''} hover:shadow-card-hover`}
        >
          {/* Day header */}
          <div
            {...provided.dragHandleProps}
            className="flex justify-between items-center px-4 py-3 rounded-t-lg text-blue-900 bg-gradient-to-br from-sky-100 via-blue-100 to-blue-200 dark:from-gray-700/50 dark:via-gray-800 dark:to-gray-700/80 dark:text-gray-100 transition-colors duration-200 border-b border-blue-200/50 dark:border-gray-600/30"
          >
            <div className="flex-1 flex items-center">
              <div
                {...provided.dragHandleProps}
                className="mr-2 cursor-move p-1 rounded-md hover:bg-sky-100 dark:hover:bg-gray-700/70 transition-colors"
                title="Drag to reorder days"
              >
                <ArrowsUpDownIcon className="w-5 h-5 text-sky-400 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {formatDayDate(day.date)}
              </h2>
            </div>
            <button 
              onClick={handleDeleteDay}
              className="p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              title="Delete day"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Weather info - would be real data in production */}
          <div className="mt-2 flex items-center gap-2 px-4">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-sky-100 dark:bg-gray-700/70 shadow-sm ${weather.color} dark:text-gray-100`}>
              {weather.icon}
              <span className="text-sm font-medium">{weather.temp}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Forecast
            </span>
          </div>
          
          {/* Activity list */}
          <Droppable droppableId={day.id} type="activity">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 p-3 overflow-y-auto transition-colors ${
                  snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                {day.activities.map((activity, activityIndex) => (
                  <ActivityCard 
                    key={activity.id} 
                    activity={activity} 
                    dayId={day.id} 
                    index={activityIndex} 
                  />
                ))}
                {provided.placeholder}
                
                {/* Add activity form */}
                {isAddingActivity ? (
                  <div className="p-4 bg-white dark:bg-gray-700/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-600/50">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">Add New Activity</h3>
                    
                    <div className="mb-3">
                      <input
                        type="text"
                        name="title"
                        value={newActivity.title}
                        onChange={handleChange}
                        placeholder="Activity title"
                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">Time</label>
                        <input
                          type="time"
                          name="time"
                          value={newActivity.time}
                          onChange={handleChange}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">Category</label>
                        <select
                          name="category"
                          value={newActivity.category}
                          onChange={handleChange}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        >
                          <option value="activity">Activity</option>
                          <option value="attraction">Attraction</option>
                          <option value="food">Food</option>
                          <option value="lodging">Lodging</option>
                          <option value="transport">Transport</option>
                          <option value="shopping">Shopping</option>
                          <option value="event">Event</option>
                          <option value="meeting">Meeting</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <LocationTimezoneInput
                      location={newActivity.location}
                      timezone={newActivity.timezone}
                      onChange={handleLocationTimezoneChange}
                    />
                    
                    <div className="mb-3">
                      <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">Notes (optional)</label>
                      <textarea
                        name="notes"
                        value={newActivity.notes}
                        onChange={handleChange}
                        placeholder="Add notes..."
                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        rows="2"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleAddActivityToggle}
                        className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddActivity}
                        disabled={!newActivity.title}
                        className={`px-3 py-1 text-sm rounded ${
                          newActivity.title
                            ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        } transition-colors`}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleAddActivityToggle}
                    className="mt-2 w-full py-2 flex items-center justify-center gap-1 text-sm bg-white dark:bg-gray-700/70 hover:bg-blue-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-gray-600/50 transition-colors shadow-sm"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Activity</span>
                  </button>
                )}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default DayColumn; 