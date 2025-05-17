import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useTrip } from '../context/TripContext';
import { showConfirmToast } from './CustomToast';
import LocationTimezoneInput from './LocationTimezoneInput';

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
  
  const handleLocationTimezoneChange = (field, value) => {
    setEditedActivity(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleDelete = () => {
    showConfirmToast(
      'Delete Activity',
      `Are you sure you want to delete "${activity.title}"?`,
      () => removeActivity(dayId, activity.id),
      null
    );
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
          className={`relative mb-3 rounded-xl shadow-card border border-blue-100 dark:border-gray-700/50 transition-all duration-200 border-l-4 ${categoryBorders[activity.category] || 'border-gray-300'} ${
            activity.isCompleted 
              ? 'bg-blue-50 dark:bg-gray-800/80 opacity-75' 
              : 'bg-white dark:bg-gray-700/90'
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
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="Activity title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={editedActivity.time}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">Category</label>
                  <select
                    name="category"
                    value={editedActivity.category}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
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
              
              {/* Integrated location and timezone input */}
              <LocationTimezoneInput 
                location={editedActivity.location || ''}
                timezone={editedActivity.timezone || 'local'}
                onChange={handleLocationTimezoneChange}
              />
              
              <div className="mb-3">
                <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={editedActivity.notes}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  rows="2"
                  placeholder="Add notes here..."
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-3 py-1 text-sm bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 dark:from-gray-800/90 dark:via-gray-700/80 dark:to-gray-800/90 hover:scale-[1.02] dark:border-t dark:border-r dark:border-b dark:border-gray-600/30 dark:hover:border-blue-900/50 rounded-xl transition-all duration-200 backdrop-blur-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div 
                    className={`p-2 rounded-full ${
                      activity.isCompleted 
                        ? 'bg-gray-200 dark:bg-gray-600/70' 
                        : 'bg-blue-100 dark:bg-blue-900/50 dark:border dark:border-blue-800/50'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${
                      activity.isCompleted 
                        ? 'text-gray-500 dark:text-gray-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${activity.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                      {activity.title}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {/* <ClockIcon className="w-4 h-4 mr-1 text-blue-500 dark:text-blue-400" /> */}
                      <span className="ml-1">{getTimezoneIcon()}</span>
                      <span className="ml-1">{getFormattedTime()}</span>
                    </div>
                    
                    {activity.location && (
                      <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                        <MapPinIcon className="w-4 h-4 mr-1 text-red-500 dark:text-red-400" />
                        <span>{activity.location}</span>
                      </div>
                    )}
                    
                    {activity.notes && (
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800/70 border-l-2 border-gray-300 dark:border-gray-600 rounded text-sm text-gray-600 dark:text-gray-300">
                        {activity.notes}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <button
                    onClick={toggleComplete}
                    className={`p-1.5 rounded-full ${
                      activity.isCompleted
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800/70 dark:text-gray-400 dark:border dark:border-gray-700'
                    } hover:opacity-80 transition-colors`}
                    title={activity.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="p-1.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800/70 dark:text-gray-400 dark:border dark:border-gray-700 hover:opacity-80 transition-colors"
                    title="Edit activity"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-full bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400 hover:opacity-80 transition-colors"
                    title="Delete activity"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default ActivityCard; 