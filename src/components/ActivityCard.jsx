import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useTrip } from '../context/TripContext';

// Import Heroicons
import {
  HomeIcon,
  BriefcaseIcon,
  CakeIcon,
  CalendarIcon,
  CameraIcon,
  ClockIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  HeartIcon,
  MapIcon,
  MapPinIcon,
  PencilIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TicketIcon,
  TrashIcon,
  TruckIcon,
  UserGroupIcon,
  XMarkIcon,
  CheckIcon,
  PlusIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  ClockIcon as ClockSolidIcon,
} from '@heroicons/react/24/outline';

const categoryIcons = {
  lodging: HomeIcon,
  food: CakeIcon,
  attraction: CameraIcon,
  activity: SparklesIcon,
  transport: TruckIcon,
  shopping: ShoppingBagIcon,
  event: TicketIcon,
  meeting: UserGroupIcon,
  work: BriefcaseIcon,
  other: GlobeAltIcon,
};

const categoryBorders = {
  lodging: 'border-blue-500', // Hotel
  food: 'border-rose-500', // Food
  attraction: 'border-green-500', // Tour/Attraction
  activity: 'border-teal-500', 
  transport: 'border-purple-500', 
  shopping: 'border-amber-500', 
  event: 'border-pink-500', 
  meeting: 'border-indigo-500', 
  work: 'border-yellow-500', 
  other: 'border-gray-500', 
};

const ActivityCard = ({ activity, dayId, index }) => {
  const { updateActivity, removeActivity } = useTrip();
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState({ ...activity });
  
  const IconComponent = categoryIcons[activity.category] || GlobeAltIcon;
  
  const handleEditToggle = () => {
    if (isEditing) {
      updateActivity(dayId, activity.id, editedActivity);
    }
    setIsEditing(!isEditing);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDelete = () => {
    removeActivity(dayId, activity.id);
  };
  
  const toggleComplete = () => {
    updateActivity(dayId, activity.id, {
      isCompleted: !activity.isCompleted
    });
  };
  
  // Weather icons (for future weather integration)
  const getWeatherIcon = () => {
    const weatherType = Math.floor(Math.random() * 3); // Mock random weather for demo
    switch (weatherType) {
      case 0: return <SunIcon className="w-5 h-5 text-yellow-400" title="Sunny" />;
      case 1: return <CloudIcon className="w-5 h-5 text-gray-400" title="Cloudy" />;
      case 2: return <MoonIcon className="w-5 h-5 text-indigo-400" title="Clear night" />;
      default: return <SunIcon className="w-5 h-5 text-yellow-400" title="Sunny" />;
    }
  };
  
  // Get timezone icon
  const getTimezoneIcon = () => {
    switch (activity.timezone) {
      case 'destination':
        return <MapIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" title="Destination timezone" />;
      case 'home':
        return <HomeIcon className="w-4 h-4 text-green-500 dark:text-green-400" title="Home timezone" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" title="Local timezone" />;
    }
  };
  
  // Format time based on timezone
  const getFormattedTime = () => {
    // In a real app, this would implement actual timezone conversion
    // For now we'll just show the time with an indicator of which timezone it is
    if (activity.timezone === 'destination') {
      return `${activity.time} (Dest)`;
    } else if (activity.timezone === 'home') {
      return `${activity.time} (Home)`;
    }
    return activity.time;
  };
  
  return (
    <Draggable draggableId={activity.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`relative mb-3 rounded-xl shadow-card border border-blue-100 dark:border-gray-700 transition-all duration-200 border-l-4 ${categoryBorders[activity.category] || 'border-gray-300'} ${
            activity.isCompleted 
              ? 'bg-blue-50 dark:bg-gray-800 opacity-75' 
              : 'bg-white dark:bg-gray-700'
          } ${
            snapshot.isDragging
              ? 'shadow-card-hover scale-105 z-50'
              : ''
          }`}
        >
          {isEditing ? (
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <input
                  type="text"
                  name="title"
                  value={editedActivity.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Activity title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={editedActivity.time}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Category</label>
                  <select
                    name="category"
                    value={editedActivity.category}
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
                    value={editedActivity.location || ''}
                    onChange={handleChange}
                    placeholder="Activity location"
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Timezone</label>
                  <select
                    name="timezone"
                    value={editedActivity.timezone || 'local'}
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
                  value={editedActivity.notes}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  rows="2"
                  placeholder="Add notes here..."
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            // <div className="p-4 bg-gradient-to-br dark:from-[#4b6cb7] dark:to-[#182848]">
            <div className="p-4 bg-gradient-to-br from-orange-50 via-indigo-100 to-teal-100 dark:from-[#2c3e50] dark:to-[#4ca1af] hover:scale-[1.05] dark:border dark:border-gray-600 dark:hover:border-teal-600 rounded-xl transiton-ease-in-out duration-200">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div 
                    className={`p-2 rounded-full ${
                      activity.isCompleted ? 'bg-gray-200 dark:bg-gray-600' : 'bg-blue-100 dark:bg-blue-900'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${activity.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                      {activity.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        {getTimezoneIcon()}
                        <span className="ml-1">{getFormattedTime()}</span>
                      </div>
                      
                      {activity.location && (
                        <div className="flex items-center">
                          <MapPinIcon className="w-4 h-4 text-red-500 dark:text-red-400" />
                          <span className="ml-1">{activity.location}</span>
                        </div>
                      )}
                      
                      {/* Mock weather indicator - in real app this would fetch data */}
                      <div className="flex items-center" title="Weather forecast">
                        {getWeatherIcon()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={toggleComplete}
                    className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-300 transition-colors"
                  >
                    <div className="relative group">
                        <CheckIcon className={`w-5 h-5 ${activity.isCompleted ? 'text-green-500' : 'text-gray-900'} cursor-pointer`} />
                        <span className="absolute bottom-[-4vh] left-1/2 -translate-x-1/2 w-max bg-teal-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
                            Completed
                        </span>
                    </div>
                  </button>
                  <button 
                    onClick={handleEditToggle}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="relative group">
                        <PencilIcon className="w-5 h-5 text-gray-800" />
                        <span className="absolute bottom-[2.5vh] left-1/2 -translate-x-1/2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
                            Edit
                        </span>
                    </div>
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="p-1 rounded-full hover:bg-red-100 hover:text-red-700 transition-colors"
                  >
                    <div className="relative group">
                    <TrashIcon className="w-5 h-5 text-red-500 " />
                    <span className="absolute bottom-[-4vh] left-1/2 -translate-x-1/2 w-max bg-red-300 text-black text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
                        Delete
                    </span>
                    </div>
                  </button>
                </div>
              </div>
              
              {activity.notes && (
                <div className="mt-3 pl-10 text-sm text-gray-600 dark:text-gray-300">
                  <p>{activity.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default ActivityCard; 