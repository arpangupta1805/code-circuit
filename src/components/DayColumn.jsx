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
  
  const handleAddActivity = () => {
    // Only add if title is not empty
    if (newActivity.title.trim() !== '') {
      addActivity(day.id, newActivity);
      handleAddActivityToggle();
    }
  };
  
  const handleDeleteDay = () => {
    if (window.confirm('Are you sure you want to delete this day?')) {
      removeDay(day.id);
    }
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
          // style={{background: `linear-gradient(135deg, #a3f7bf, #d3cce3)`}}
          className={`flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-200  dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364] w-96 h-full bg-white dark:bg-gray-900 rounded-2xl shadow-card dark:border-gray-700 flex flex-col transition-all duration-300 ${
            snapshot.isDragging ? 'scale-[1.02] shadow-lg z-50' : ''
          } ${isDragging ? 'opacity-90' : ''} hover:shadow-card-hover`}
        >
          {/* Day header */}
          <div
            {...provided.dragHandleProps}
            className="flex justify-between items-center px-4 py-2 rounded-t-lg text-blue-900 bg-gradient-to-br from-sky-100 via-blue-100 to-blue-200 dark:bg-gray-800 dark:from-transparent dark:via-transparent dark:to-transparent dark:text-gray-100 transition-colors duration-200"
          >
            <div className="flex-1 flex items-center">
              <div
                {...provided.dragHandleProps}
                className="mr-2 cursor-move p-1 rounded-md hover:bg-sky-100 dark:hover:bg-gray-700 transition-colors"
                title="Drag to reorder days"
              >
                <ArrowsUpDownIcon className="w-5 h-5 text-sky-400 dark:text-gray-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {formatDayDate(day.date)}
              </h2>
            </div>
            <button 
              onClick={handleDeleteDay}
              className="p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
              title="Delete day"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Weather info - would be real data in production */}
          <div className="mt-2 flex items-center gap-2 px-4">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-sky-100 dark:bg-gray-800 shadow-sm ${weather.color}`}>
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
                  <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">Add New Activity</h3>
                    
                    <div className="mb-3">
                      <input
                        type="text"
                        name="title"
                        value={newActivity.title}
                        onChange={handleChange}
                        placeholder="Activity title"
                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Time</label>
                        <input
                          type="time"
                          name="time"
                          value={newActivity.time}
                          onChange={handleChange}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Category</label>
                        <select
                          name="category"
                          value={newActivity.category}
                          onChange={handleChange}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        >
                          <option value="lodging">Lodging</option>
                          <option value="food">Food</option>
                          <option value="attraction">Attraction</option>
                          <option value="activity">Activity</option>
                          <option value="transport">Transport</option>
                          <option value="shopping">Shopping</option>
                          <option value="event">Event</option>
                          <option value="meeting">Meeting</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={newActivity.location}
                          onChange={handleChange}
                          placeholder="Activity location"
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Timezone</label>
                        <select
                          name="timezone"
                          value={newActivity.timezone}
                          onChange={handleChange}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        >
                          <option value="local">Local Time</option>
                          <option value="destination">Destination Time</option>
                          <option value="home">Home Time</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</label>
                      <textarea
                        name="notes"
                        value={newActivity.notes}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Add notes here..."
                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleAddActivityToggle}
                        className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddActivity}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Add Activity
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleAddActivityToggle}
                    className="mt-2 w-full p-3 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-600 text-gray-500 dark:text-gray-400 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors"
                  >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Add Activity
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