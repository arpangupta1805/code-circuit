import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const TripContext = createContext();

const defaultTrip = {
  id: uuidv4(),
  name: 'My Paris Trip',
  destination: 'Paris, France',
  departureLocation: 'New York, USA',
  startDate: new Date(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
  days: [
    {
      id: uuidv4(),
      date: new Date(),
      activities: [
        {
          id: uuidv4(),
          title: 'Check-in at Hotel',
          time: '14:00',
          category: 'lodging',
          notes: 'Hotel de Ville - Confirmation #12345',
          isCompleted: false,
          location: 'Hotel de Ville',
          timezone: 'destination',
        },
        {
          id: uuidv4(),
          title: 'Dinner at Le Cafe',
          time: '19:00',
          category: 'food',
          notes: 'Make reservation',
          isCompleted: false,
          location: 'Le Cafe on Champs-Élysées',
          timezone: 'local',
        },
      ],
    },
    {
      id: uuidv4(),
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      activities: [
        {
          id: uuidv4(),
          title: 'Visit Eiffel Tower',
          time: '10:00',
          category: 'attraction',
          notes: 'Buy tickets in advance',
          isCompleted: false,
        },
        {
          id: uuidv4(),
          title: 'Lunch at Bistro',
          time: '13:00',
          category: 'food',
          notes: '',
          isCompleted: false,
        },
        {
          id: uuidv4(),
          title: 'Louvre Museum',
          time: '15:00',
          category: 'attraction',
          notes: 'Spend at least 3 hours here',
          isCompleted: false,
        },
      ],
    },
    {
      id: uuidv4(),
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      activities: [
        {
          id: uuidv4(),
          title: 'Seine River Cruise',
          time: '11:00',
          category: 'transport',
          notes: '',
          isCompleted: false,
        },
        {
          id: uuidv4(),
          title: 'Shopping at Champs-Élysées',
          time: '14:00',
          category: 'shopping',
          notes: 'Buy souvenirs',
          isCompleted: false,
        },
      ],
    },
    {
      id: uuidv4(),
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      activities: [
        {
          id: uuidv4(),
          title: 'Hotel Checkout',
          time: '11:00',
          category: 'lodging',
          notes: 'Pack everything the night before',
          isCompleted: false,
        },
        {
          id: uuidv4(),
          title: 'Airport Transfer',
          time: '13:00',
          category: 'transport',
          notes: 'Flight at 16:30',
          isCompleted: false,
        },
      ],
    },
  ],
};

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState(() => {
    const savedTrips = localStorage.getItem('trips');
    if (!savedTrips) return [defaultTrip];
    
    try {
      const parsedTrips = JSON.parse(savedTrips);
      return Array.isArray(parsedTrips) && parsedTrips.length > 0 ? parsedTrips : [defaultTrip];
    } catch (error) {
      console.error('Error parsing saved trips:', error);
      return [defaultTrip];
    }
  });
  
  const [currentTripId, setCurrentTripId] = useState(() => {
    const savedId = localStorage.getItem('currentTripId');
    return savedId || (trips[0]?.id || null);
  });

  const currentTrip = trips.find(trip => trip.id === currentTripId) || trips[0];

  useEffect(() => {
    try {
      localStorage.setItem('trips', JSON.stringify(trips));
    } catch (error) {
      console.error('Error saving trips to localStorage:', error);
    }
  }, [trips]);

  useEffect(() => {
    if (currentTripId) {
      localStorage.setItem('currentTripId', currentTripId);
    }
  }, [currentTripId]);

  // Create a new trip
  const createTrip = (tripData) => {
    const newTrip = {
      id: uuidv4(),
      ...tripData,
      departureLocation: tripData.departureLocation || 'Home',
      days: [],
    };
    
    // Generate days based on start and end dates
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      
      newTrip.days.push({
        id: uuidv4(),
        date,
        activities: [],
      });
    }
    
    setTrips(prev => [...prev, newTrip]);
    setCurrentTripId(newTrip.id);
    return newTrip;
  };

  // Update trip details
  const updateTrip = (tripId, updatedData) => {
    setTrips(prev => 
      prev.map(trip => 
        trip.id === tripId ? { ...trip, ...updatedData } : trip
      )
    );
  };

  // Delete a trip
  const deleteTrip = (tripId) => {
    setTrips(prev => prev.filter(trip => trip.id !== tripId));
    // If we're deleting the current trip, set current to the first remaining trip
    if (currentTripId === tripId) {
      const remainingTrips = trips.filter(trip => trip.id !== tripId);
      setCurrentTripId(remainingTrips[0]?.id || null);
    }
  };

  // Add a new day to the current trip
  const addDay = (date) => {
    setTrips(prev => 
      prev.map(trip => {
        if (trip.id === currentTripId) {
          return {
            ...trip,
            days: [
              ...trip.days,
              {
                id: uuidv4(),
                date,
                activities: [],
              }
            ]
          };
        }
        return trip;
      })
    );
  };

  // Remove a day from the current trip
  const removeDay = (dayId) => {
    setTrips(prev => 
      prev.map(trip => {
        if (trip.id === currentTripId) {
          return {
            ...trip,
            days: trip.days.filter(day => day.id !== dayId)
          };
        }
        return trip;
      })
    );
  };

  // Add an activity to a specific day
  const addActivity = (dayId, activity) => {
    setTrips(prev => 
      prev.map(trip => {
        if (trip.id === currentTripId) {
          return {
            ...trip,
            days: trip.days.map(day => {
              if (day.id === dayId) {
                return {
                  ...day,
                  activities: [...day.activities, { 
                    ...activity, 
                    id: uuidv4(),
                    location: activity.location || '',
                    timezone: activity.timezone || 'local'
                  }]
                };
              }
              return day;
            })
          };
        }
        return trip;
      })
    );
  };

  // Update an activity
  const updateActivity = (dayId, activityId, updatedActivity) => {
    setTrips(prev => 
      prev.map(trip => {
        if (trip.id === currentTripId) {
          return {
            ...trip,
            days: trip.days.map(day => {
              if (day.id === dayId) {
                return {
                  ...day,
                  activities: day.activities.map(activity => 
                    activity.id === activityId ? { ...activity, ...updatedActivity } : activity
                  )
                };
              }
              return day;
            })
          };
        }
        return trip;
      })
    );
  };

  // Remove an activity
  const removeActivity = (dayId, activityId) => {
    setTrips(prev => 
      prev.map(trip => {
        if (trip.id === currentTripId) {
          return {
            ...trip,
            days: trip.days.map(day => {
              if (day.id === dayId) {
                return {
                  ...day,
                  activities: day.activities.filter(activity => activity.id !== activityId)
                };
              }
              return day;
            })
          };
        }
        return trip;
      })
    );
  };

  // Handle drag-and-drop reordering
  const onDragEnd = (result) => {
    const { source, destination } = result;
    
    // If dropped outside a droppable area
    if (!destination) {
      return;
    }
    
    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Get the current trip from state
    const trip = trips.find(trip => trip.id === currentTripId);
    if (!trip) return;
    
    // Find the source and destination day
    const sourceDay = trip.days.find(day => day.id === source.droppableId);
    const destDay = trip.days.find(day => day.id === destination.droppableId);
    
    // If source day not found
    if (!sourceDay) return;
    
    // Create a new version of the days array
    const newDays = [...trip.days];
    
    // If moving within the same day (reordering activities)
    if (source.droppableId === destination.droppableId) {
      const dayIndex = newDays.findIndex(day => day.id === source.droppableId);
      if (dayIndex === -1) return;
      
      const newActivities = [...newDays[dayIndex].activities];
      const [moved] = newActivities.splice(source.index, 1);
      newActivities.splice(destination.index, 0, moved);
      
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        activities: newActivities,
      };
    } else {
      // Moving between different days
      // Find the indices of the source and destination days
      const sourceDayIndex = newDays.findIndex(day => day.id === source.droppableId);
      const destDayIndex = newDays.findIndex(day => day.id === destination.droppableId);
      if (sourceDayIndex === -1 || destDayIndex === -1) return;
      
      // Create new activity arrays
      const sourceActivities = [...newDays[sourceDayIndex].activities];
      const destActivities = [...newDays[destDayIndex].activities];
      
      // Remove the activity from the source day
      const [movedActivity] = sourceActivities.splice(source.index, 1);
      
      // Add the activity to the destination day
      destActivities.splice(destination.index, 0, movedActivity);
      
      // Update the days with the new activity arrays
      newDays[sourceDayIndex] = {
        ...newDays[sourceDayIndex],
        activities: sourceActivities,
      };
      
      newDays[destDayIndex] = {
        ...newDays[destDayIndex],
        activities: destActivities,
      };
    }
    
    // Update the trip with the new days
    setTrips(
      trips.map(t => 
        t.id === currentTripId ? { ...t, days: newDays } : t
      )
    );
  };

  // Add function to reorder days 
  const reorderDays = (sourceIndex, destinationIndex) => {
    setTrips(prev => 
      prev.map(trip => {
        if (trip.id === currentTripId) {
          const newDays = [...trip.days];
          const [movedDay] = newDays.splice(sourceIndex, 1);
          newDays.splice(destinationIndex, 0, movedDay);
          
          return {
            ...trip,
            days: newDays
          };
        }
        return trip;
      })
    );
  };

  const formatDayDate = (date) => {
    try {
      return format(new Date(date), 'EEEE, MMM d');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const value = {
    trips,
    currentTripId,
    currentTrip,
    setCurrentTripId,
    createTrip,
    updateTrip,
    deleteTrip,
    addDay,
    removeDay,
    addActivity,
    updateActivity,
    removeActivity,
    onDragEnd,
    reorderDays,
    formatDayDate
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}; 