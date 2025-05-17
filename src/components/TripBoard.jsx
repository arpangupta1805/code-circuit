import { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useTrip } from '../context/TripContext';
import DayColumn from './DayColumn';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from 'date-fns';
import { 
  CalendarIcon, 
  PlusCircleIcon, 
  ArrowDownOnSquareIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  PencilIcon,
  PhotoIcon,
  PaperAirplaneIcon,
  MapPinIcon,
  ClockIcon,
  GlobeAltIcon,
  ViewColumnsIcon,
  QueueListIcon,
  HomeIcon,
  BriefcaseIcon,
  CakeIcon,
  CameraIcon,
  SparklesIcon,
  ShoppingBagIcon,
  TicketIcon,
  UserGroupIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  TruckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import html2pdf from 'html2pdf.js';
import { showConfirmToast } from '../components/CustomToast';

// Popular destinations with their countries to enable filtering
const popularDestinations = [
  { city: 'Paris', country: 'France', full: 'Paris, France' },
  { city: 'London', country: 'UK', full: 'London, UK' },
  { city: 'New York', country: 'USA', full: 'New York, USA' },
  { city: 'Tokyo', country: 'Japan', full: 'Tokyo, Japan' },
  { city: 'Rome', country: 'Italy', full: 'Rome, Italy' },
  { city: 'Barcelona', country: 'Spain', full: 'Barcelona, Spain' },
  { city: 'Sydney', country: 'Australia', full: 'Sydney, Australia' },
  { city: 'Amsterdam', country: 'Netherlands', full: 'Amsterdam, Netherlands' },
  { city: 'Dubai', country: 'UAE', full: 'Dubai, UAE' },
  { city: 'Singapore', country: 'Singapore', full: 'Singapore' },
  { city: 'Istanbul', country: 'Turkey', full: 'Istanbul, Turkey' },
  { city: 'Bangkok', country: 'Thailand', full: 'Bangkok, Thailand' },
  { city: 'Berlin', country: 'Germany', full: 'Berlin, Germany' },
  { city: 'Seoul', country: 'South Korea', full: 'Seoul, South Korea' },
  { city: 'Hong Kong', country: 'China', full: 'Hong Kong, China' },
  { city: 'Toronto', country: 'Canada', full: 'Toronto, Canada' },
  { city: 'San Francisco', country: 'USA', full: 'San Francisco, USA' },
  { city: 'Rio de Janeiro', country: 'Brazil', full: 'Rio de Janeiro, Brazil' },
  { city: 'Mumbai', country: 'India', full: 'Mumbai, India' },
  { city: 'Cairo', country: 'Egypt', full: 'Cairo, Egypt' },
];

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

const TripBoard = () => {
  const { 
    currentTrip, 
    updateTrip, 
    onDragEnd, 
    addDay,
    formatDayDate,
    reorderDays,
    removeDay,
    updateActivity,
    removeActivity
  } = useTrip();
  const [newDayDate, setNewDayDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTrip, setEditedTrip] = useState({
    name: currentTrip?.name || '',
    destination: currentTrip?.destination || '',
    departureLocation: currentTrip?.departureLocation || 'Home',
  });
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Get timezone icon for the list view
  const getTimezoneIcon = (activity) => {
    switch (activity.timezone) {
      case 'destination':
        return <GlobeAltIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
      case 'home':
        return <HomeIcon className="w-4 h-4 text-green-500 dark:text-green-400" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };
  
  // Update form when current trip changes
  useEffect(() => {
    if (currentTrip) {
      setEditedTrip({
        name: currentTrip.name || '',
        destination: currentTrip.destination || '',
        departureLocation: currentTrip.departureLocation || 'Home',
      });
    }
  }, [currentTrip]);
  
  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768 && viewMode === 'list') {
        // Switch back to grid on larger screens
        setViewMode('grid');
        setSelectedDayId(null);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);
  
  const handleTripUpdate = () => {
    updateTrip(currentTrip.id, editedTrip);
    setIsEditingTitle(false);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTrip(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Filter destinations for suggestions
    if (name === 'destination') {
      if (value.trim() === '') {
        setDestinationSuggestions([]);
      } else {
        const filteredDestinations = popularDestinations
          .filter(dest => 
            dest.full.toLowerCase().includes(value.toLowerCase()) ||
            dest.city.toLowerCase().includes(value.toLowerCase()) ||
            dest.country.toLowerCase().includes(value.toLowerCase())
          )
          .map(dest => dest.full);
        setDestinationSuggestions(filteredDestinations);
      }
    }
  };
  
  const handleAddDay = () => {
    addDay(newDayDate);
    setIsDatePickerOpen(false);
  };
  
  const handleDragEnd = (result) => {
    const { type, source, destination } = result;
    
    // Dropped outside a droppable area
    if (!destination) return;
    
    // Handle different drag types
    if (type === 'day') {
      if (source.index !== destination.index) {
        reorderDays(source.index, destination.index);
      }
    } else {
      // This is for activities, handled by the context's onDragEnd
      onDragEnd(result);
    }
  };
  
  const exportToPDF = () => {
    // Create a stylized HTML representation of the trip
    const container = document.createElement('div');
    container.style.padding = '10px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.maxWidth = '800px';
    container.style.margin = '20px 20px';
    
    // Add header
    const header = document.createElement('h1');
    header.textContent = currentTrip.name;
    header.style.color = '#3b82f6';
    header.style.marginBottom = '10px';
    container.appendChild(header);
    
    // Add destination and dates
    const destDateInfo = document.createElement('div');
    destDateInfo.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <div style="margin-right: 8px; color: #3b82f6;">
          ${currentTrip.departureLocation || 'Home'}
        </div>
        <div style="position: relative; width: 120px; height: 24px;">
          <div style="height: 2px; background-color: #3b82f6; width: 100%; position: absolute; top: 50%;"></div>
          <div style="position: absolute; top: -5px; right: -10px; width: 20px; transform: rotate(45deg);">✈️</div>
        </div>
        <div style="font-weight: bold; color: #3b82f6;">
          ${currentTrip.destination}
        </div>
      </div>
      <p><strong>Dates:</strong> ${format(new Date(currentTrip.startDate), 'MMM d, yyyy')} - ${format(new Date(currentTrip.endDate), 'MMM d, yyyy')}</p>
    `;
    destDateInfo.style.marginBottom = '20px';
    container.appendChild(destDateInfo);
    
    // Add trip header image
    const headerImg = document.createElement('div');
    headerImg.style.width = '100%';
    headerImg.style.height = '150px';
    headerImg.style.backgroundImage = 'url(/images/travel-banner.jpg)';
    headerImg.style.backgroundSize = 'cover';
    headerImg.style.backgroundPosition = 'center';
    headerImg.style.marginBottom = '20px';
    headerImg.style.borderRadius = '8px';
    container.insertBefore(headerImg, container.firstChild);
    
    // Add days and activities
    currentTrip.days.forEach(day => {
      const daySection = document.createElement('div');
      daySection.style.marginBottom = '30px';
      
      const dayHeader = document.createElement('h2');
      dayHeader.textContent = formatDayDate(day.date);
      dayHeader.style.color = '#1f2937';
      dayHeader.style.borderBottom = '1px solid #e5e7eb';
      dayHeader.style.paddingBottom = '5px';
      daySection.appendChild(dayHeader);
      
      if (day.activities.length === 0) {
        const emptyDayMsg = document.createElement('p');
        emptyDayMsg.textContent = 'No activities planned for this day';
        emptyDayMsg.style.fontStyle = 'italic';
        daySection.appendChild(emptyDayMsg);
      } else {
        day.activities.forEach(activity => {
          const activityDiv = document.createElement('div');
          activityDiv.style.marginBottom = '15px';
          activityDiv.style.padding = '10px';
          activityDiv.style.backgroundColor = '#f9fafb';
          activityDiv.style.borderRadius = '8px';
          
          const status = activity.isCompleted ? '✅' : '⬜';
          
          const activityTitle = document.createElement('h3');
          activityTitle.innerHTML = `${status} ${activity.time} - ${activity.title}`;
          activityTitle.style.margin = '0 0 5px 0';
          activityTitle.style.color = '#4b5563';
          activityDiv.appendChild(activityTitle);
          
          if (activity.location) {
            const locationP = document.createElement('p');
            locationP.innerHTML = `<strong>Location:</strong> ${activity.location}`;
            locationP.style.margin = '5px 0';
            activityDiv.appendChild(locationP);
          }
          
          if (activity.notes) {
            const notesP = document.createElement('p');
            notesP.textContent = activity.notes;
            notesP.style.margin = '5px 0';
            activityDiv.appendChild(notesP);
          }
          
          const categoryP = document.createElement('p');
          categoryP.innerHTML = `<em>Category: ${activity.category}</em>`;
          categoryP.style.fontSize = '0.85em';
          categoryP.style.color = '#6b7280';
          categoryP.style.margin = '5px 0 0 0';
          activityDiv.appendChild(categoryP);
          
          daySection.appendChild(activityDiv);
        });
      }
      
      container.appendChild(daySection);
    });
    
    // Add basic CSS
    const style = document.createElement('style');
    style.textContent = `
      body { margin: 0; padding: 0; }
      * { box-sizing: border-box; }
    `;
    container.appendChild(style);
    
    // Convert to PDF
    const opt = {
      margin: 15,
      filename: `${currentTrip.name} - Itinerary.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(container).save();
  };
  
  // Add a function to handle day selection in list view
  const handleDaySelect = (dayId) => {
    if (viewMode === 'list') {
      setSelectedDayId(dayId === selectedDayId ? null : dayId);
    }
  };
  
  if (!currentTrip) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No Trip Selected</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Create a new trip to get started</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header with trip info */}
      <div style={{backgroundImage: `url('https://static.vecteezy.com/system/resources/thumbnails/046/605/934/small_2x/sky-with-a-beautiful-sunset-a-blue-and-orange-sky-with-soft-clouds-a-sky-background-photo.jpg')` }}
      className={`p-4 bg-no-repeat bg-cover shadow-md mb-4 rounded-lg relative overflow-hidden transition-all duration-300 ${isEditingTitle ? '' : 'bg-gradient-to-br from-violet-200 via-gray-300 to-indigo-300 dark:from-gray-800/80 dark:via-gray-900/80 dark:to-indigo-900/80'}`}>
        
        {/* Dark overlay for better text readability in dark mode */}
        <div className="absolute inset-0 bg-black/0 dark:bg-black/40 transition-colors duration-300"></div>
        
        <div className="flex flex-wrap justify-between items-center relative z-10">
          <div className="flex-1">
            {isEditingTitle ? (
              <div className="space-y-3 max-w-md animate-fade-in">
                <input
                  type="text"
                  name="name"
                  value={editedTrip.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xl font-bold border rounded dark:bg-gray-700/90 dark:border-gray-600 dark:text-white transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Trip name"
                />
                
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">From</label>
                    <input
                      type="text"
                      name="departureLocation"
                      value={editedTrip.departureLocation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded dark:bg-gray-700/90 dark:border-gray-600 dark:text-white transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Departure location"
                    />
                  </div>
                  
                  <div className="flex-1 relative">
                    <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">To</label>
                    <input
                      type="text"
                      name="destination"
                      value={editedTrip.destination}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded dark:bg-gray-700/90 dark:border-gray-600 dark:text-white transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Destination"
                      list="destination-suggestions"
                    />
                    {editedTrip.destination && destinationSuggestions.length > 0 && (
                      <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
                        {destinationSuggestions.map((suggestion, index) => (
                          <li 
                            key={index}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                            onClick={() => {
                              setEditedTrip(prev => ({ ...prev, destination: suggestion }));
                              setDestinationSuggestions([]);
                            }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditingTitle(false);
                      setDestinationSuggestions([]);
                    }}
                    className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTripUpdate}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white animate-fade-in drop-shadow-sm dark:drop-shadow-md">
                    {currentTrip.name}
                  </h1>
                  
                  
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex font-bold items-center text-indigo-800 dark:text-indigo-300 font-medium">
                      <PaperAirplaneIcon className="w-4 h-4 mr-1 transform -rotate-45" />
                      {currentTrip.departureLocation || 'Home'}
                    </span>
                    <span className="mx-2 text-gray-400 dark:text-gray-500">→</span>
                    <span className="flex items-center font-bold text-red-600 dark:text-red-300 font-medium">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {currentTrip.destination}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-sm dark:text-gray-200 font-bold animate-fade-in animation-delay-200">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>
                      {format(new Date(currentTrip.startDate), 'MMM d')} - {format(new Date(currentTrip.endDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="ml-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  title="Edit trip details"
                >
                  <PencilIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            {/* View mode toggle */}
            <div className="inline-flex bg-gray-100 dark:bg-gray-800/70 rounded-lg p-1 shadow-inner">
              <button
                onClick={() => {
                  setViewMode('list');
                  setSelectedDayId(null);
                }}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="List view"
              >
                <QueueListIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setViewMode('grid');
                  setSelectedDayId(null);
                }}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="Grid view"
              >
                <ViewColumnsIcon className="w-5 h-5" />
              </button>
            </div>
          
            <button
              onClick={exportToPDF}
              className="flex items-center gap-1 px-3 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-md"
              title="Export as PDF"
            >
              <ArrowDownOnSquareIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            
            <button
              onClick={() => setIsDatePickerOpen(true)}
              className="flex items-center gap-1 px-3 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-md"
              title="Add a new day"
            >
              <PlusCircleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Add Day</span>
            </button>
          </div>
        </div>
        
        {/* Date picker for adding new day */}
        {isDatePickerOpen && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg animate-fade-in">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Add New Day</h3>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Date</label>
                <DatePicker
                  selected={newDayDate}
                  onChange={(date) => setNewDayDate(date)}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsDatePickerOpen(false)}
                  className="px-3 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDay}
                  className="px-3 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors duration-300"
                >
                  Add Day
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main board content */}
      <div 
        id="trip-board-content" 
        className="flex-1 overflow-hidden"
      >
        {viewMode === 'grid' ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="days" direction="horizontal" type="day">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="h-full pb-4 overflow-x-auto overflow-y-hidden"
                >
                  <div className="flex gap-4 h-full px-4 min-w-max">
                    {currentTrip.days.map((day, index) => (
                      <DayColumn key={day.id} day={day} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="overflow-y-auto h-full pb-4">
            <div className="space-y-6 px-4">
              {currentTrip.days.map((day, index) => (
                <div 
                  key={day.id}
                  className={`rounded-xl overflow-hidden transition-all duration-300 shadow-card ${
                    selectedDayId === day.id ? 'shadow-card-hover transform scale-[1.01]' : ''
                  }`}
                >
                  <div 
                    className={`p-4 cursor-pointer flex justify-between items-center bg-gradient-to-r ${
                      index % 3 === 0 ? 'from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40' :
                      index % 3 === 1 ? 'from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40' :
                      'from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40'
                    } border-b border-blue-200/50 dark:border-gray-700`}
                    onClick={() => handleDaySelect(day.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full bg-white/70 dark:bg-gray-800/70 shadow-inner flex items-center justify-center ${
                        index % 3 === 0 ? 'text-blue-600 dark:text-blue-400' :
                        index % 3 === 1 ? 'text-amber-600 dark:text-amber-400' :
                        'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        <CalendarIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{formatDayDate(day.date)}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            day.activities.length > 0 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">
                            {format(new Date(day.date), 'EEEE, MMMM d')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedDayId === day.id ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDayId(null);
                          }}
                          className={`p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 ${
                            index % 3 === 0 ? 'text-blue-600 dark:text-blue-400' :
                            index % 3 === 1 ? 'text-amber-600 dark:text-amber-400' :
                            'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          <ChevronUpIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <button 
                          className={`p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 ${
                            index % 3 === 0 ? 'text-blue-600 dark:text-blue-400' :
                            index % 3 === 1 ? 'text-amber-600 dark:text-amber-400' :
                            'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          <ChevronDownIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {selectedDayId === day.id && (
                    <div className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 animate-fade-in">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`${
                            index % 3 === 0 ? 'text-blue-600 dark:text-blue-400' :
                            index % 3 === 1 ? 'text-amber-600 dark:text-amber-400' :
                            'text-emerald-600 dark:text-emerald-400'
                          } font-semibold`}>Activities</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {format(new Date(day.date), 'EEEE, MMMM d')}
                          </span>
                        </div>
                        <button
                          onClick={() => removeDay(day.id)}
                          className="p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                          title="Delete day"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {day.activities.length === 0 ? (
                          <div className="text-center p-8 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700">
                            <div className="flex flex-col items-center">
                              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-2">
                                <CalendarIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 mb-4">No activities planned for this day</p>
                              <button
                                onClick={() => {
                                  setViewMode('grid');
                                  setSelectedDayId(day.id);
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm hover:shadow flex items-center gap-2"
                              >
                                <PlusCircleIcon className="w-5 h-5" />
                                <span>Add Activity</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {day.activities.map((activity, activityIndex) => {
                              const IconComponent = categoryIcons[activity.category] || GlobeAltIcon;
                              const categoryColor = 
                                activity.category === 'lodging' ? 'blue' :
                                activity.category === 'food' ? 'rose' :
                                activity.category === 'attraction' ? 'green' :
                                activity.category === 'activity' ? 'teal' :
                                activity.category === 'transport' ? 'purple' :
                                activity.category === 'shopping' ? 'amber' :
                                activity.category === 'event' ? 'pink' :
                                activity.category === 'meeting' ? 'indigo' :
                                activity.category === 'work' ? 'yellow' : 'gray';
                              
                              return (
                                <div 
                                  key={activity.id} 
                                  className={`p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border-l-4 ${
                                    activity.isCompleted 
                                      ? 'border-gray-300 dark:border-gray-600 opacity-70' 
                                      : `border-${categoryColor}-500`
                                  } hover:shadow-md transition-all duration-200`}
                                >
                                  <div className="flex gap-4 items-start">
                                    <div className={`p-3 rounded-full ${
                                      activity.isCompleted
                                        ? 'bg-gray-100 dark:bg-gray-700'
                                        : `bg-${categoryColor}-100 dark:bg-${categoryColor}-900/30`
                                    }`}>
                                      <IconComponent className={`w-6 h-6 ${
                                        activity.isCompleted
                                          ? 'text-gray-400 dark:text-gray-500'
                                          : `text-${categoryColor}-600 dark:text-${categoryColor}-400`
                                      }`} />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <h4 className={`font-medium text-lg ${
                                          activity.isCompleted 
                                            ? 'line-through text-gray-500 dark:text-gray-400' 
                                            : 'text-gray-800 dark:text-white'
                                        }`}>
                                          {activity.title}
                                        </h4>
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => {
                                              updateActivity(day.id, activity.id, {
                                                isCompleted: !activity.isCompleted
                                              });
                                            }}
                                            className={`p-1 rounded-full ${
                                              activity.isCompleted
                                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                            } hover:opacity-80`}
                                            title={activity.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                                          >
                                            <CheckIcon className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => {
                                              setViewMode('grid');
                                              // This would need additional logic to focus the activity for editing
                                            }}
                                            className="p-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:opacity-80"
                                            title="Edit activity"
                                          >
                                            <PencilIcon className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => {
                                              showConfirmToast(
                                                'Delete Activity',
                                                `Are you sure you want to delete "${activity.title}"?`,
                                                () => removeActivity(day.id, activity.id),
                                                null
                                              );
                                            }}
                                            className="p-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:opacity-80"
                                            title="Delete activity"
                                          >
                                            <TrashIcon className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm">
                                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                                          <ClockIcon className="w-4 h-4 mr-1" />
                                          <span>{activity.time}</span>
                                        </div>
                                        
                                        {activity.location && (
                                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                                            <MapPinIcon className="w-4 h-4 mr-1 text-red-500 dark:text-red-400" />
                                            <span>{activity.location}</span>
                                          </div>
                                        )}
                                        
                                        <div className="flex items-center">
                                          {getTimezoneIcon(activity)}
                                          <span className="ml-1 text-gray-500 dark:text-gray-400 text-xs">
                                            {activity.timezone === 'destination' ? 'Destination time' : 
                                             activity.timezone === 'home' ? 'Home time' : 'Local time'}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      {activity.notes && (
                                        <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-600 dark:text-gray-300 border-l-2 border-gray-300 dark:border-gray-600">
                                          {activity.notes}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            <div className="flex justify-center mt-4">
                              <button
                                onClick={() => {
                                  setViewMode('grid');
                                  setSelectedDayId(day.id);
                                }}
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                              >
                                <PlusCircleIcon className="w-5 h-5" />
                                <span>Add More Activities</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripBoard; 