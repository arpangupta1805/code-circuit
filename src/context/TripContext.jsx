import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { showActivityReminder } from '../components/CustomToast';
import { isActivityComingSoon } from '../utils/activityUtils';

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
    if (!savedTrips) return [];
    
    try {
      const parsedTrips = JSON.parse(savedTrips);
      return Array.isArray(parsedTrips) && parsedTrips.length > 0 ? parsedTrips : [];
    } catch (error) {
      console.error('Error parsing saved trips:', error);
      return [];
    }
  });
  
  const [currentTripId, setCurrentTripId] = useState(() => {
    const savedId = localStorage.getItem('currentTripId');
    return savedId || (trips[0]?.id || null);
  });

  const currentTrip = trips.find(trip => trip.id === currentTripId) || trips[0];

  // Save trips to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('trips', JSON.stringify(trips));
    } catch (error) {
      console.error('Error saving trips to localStorage:', error);
    }
  }, [trips]);

  // Save current trip ID to localStorage when it changes
  useEffect(() => {
    if (currentTripId) {
      localStorage.setItem('currentTripId', currentTripId);
    }
  }, [currentTripId]);

  // Check for upcoming activities every minute
  useEffect(() => {
    if (!currentTrip) return;
    
    const checkUpcomingActivities = () => {
      currentTrip.days.forEach(day => {
        day.activities.forEach(activity => {
          if (isActivityComingSoon(activity, day.date)) {
            showActivityReminder(
              currentTrip.name,
              activity.title,
              activity.time
            );
          }
        });
      });
    };
    
    // Initial check
    checkUpcomingActivities();
    
    // Set up interval
    const intervalId = setInterval(checkUpcomingActivities, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [currentTrip]);

  // Load the default example trip
  const loadDefaultTrip = () => {
    const newDefaultTrip = {
      ...defaultTrip,
      id: uuidv4(),
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      days: defaultTrip.days.map((day, index) => ({
        ...day,
        id: uuidv4(),
        date: new Date(new Date().setDate(new Date().getDate() + index)),
        activities: day.activities.map(activity => ({
          ...activity,
          id: uuidv4()
        }))
      }))
    };
    
    setTrips(prev => [...prev, newDefaultTrip]);
    setCurrentTripId(newDefaultTrip.id);
  };

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
          const newDay = {
            id: uuidv4(),
            date,
            activities: [],
          };
          
          // Create a new array with all days including the new one
          const updatedDays = [...trip.days];
          
          // Find the correct position to insert the new day based on date
          const newDayTime = new Date(date).getTime();
          let insertIndex = updatedDays.findIndex(day => 
            new Date(day.date).getTime() > newDayTime
          );
          
          // If no day with a later date is found, append to the end
          if (insertIndex === -1) {
            insertIndex = updatedDays.length;
          }
          
          // Insert the new day at the correct position
          updatedDays.splice(insertIndex, 0, newDay);
          
          return {
            ...trip,
            days: updatedDays
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
                    activity.id === activityId 
                      ? { ...activity, ...updatedActivity }
                      : activity
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

  // Helper function to sort days by date
  const sortDaysByDate = (days) => {
    return [...days].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };

  // Handle drag and drop of activities
  const onDragEnd = (result) => {
    const { source, destination } = result;
    
    // Dropped outside a droppable area
    if (!destination) return;
    
    // Moving within the same day
    if (source.droppableId === destination.droppableId) {
      setTrips(prev => 
        prev.map(trip => {
          if (trip.id === currentTripId) {
            return {
              ...trip,
              days: trip.days.map(day => {
                if (day.id === source.droppableId) {
                  const newActivities = Array.from(day.activities);
                  const [movedActivity] = newActivities.splice(source.index, 1);
                  newActivities.splice(destination.index, 0, movedActivity);
                  
                  return {
                    ...day,
                    activities: newActivities
                  };
                }
                return day;
              })
            };
          }
          return trip;
        })
      );
    } 
    // Moving to a different day
    else {
      setTrips(prev => 
        prev.map(trip => {
          if (trip.id === currentTripId) {
            // Find the source and destination days
            const sourceDay = trip.days.find(day => day.id === source.droppableId);
            const destDay = trip.days.find(day => day.id === destination.droppableId);
            
            if (!sourceDay || !destDay) return trip;
            
            // Copy the activity being moved
            const activityToMove = { ...sourceDay.activities[source.index] };
            
            // Create new arrays for both days' activities
            const newSourceActivities = Array.from(sourceDay.activities);
            newSourceActivities.splice(source.index, 1);
            
            const newDestActivities = Array.from(destDay.activities);
            newDestActivities.splice(destination.index, 0, activityToMove);
            
            // Update the days
            return {
              ...trip,
              days: trip.days.map(day => {
                if (day.id === source.droppableId) {
                  return { ...day, activities: newSourceActivities };
                }
                if (day.id === destination.droppableId) {
                  return { ...day, activities: newDestActivities };
                }
                return day;
              })
            };
          }
          return trip;
        })
      );
    }
  };

  // Reorder days
  const reorderDays = (sourceIndex, destinationIndex) => {
    setTrips(prev => 
      prev.map(trip => {
        if (trip.id === currentTripId) {
          // Sort days by date to maintain chronological order
          return {
            ...trip,
            days: sortDaysByDate(trip.days)
          };
        }
        return trip;
      })
    );
  };

  // Format day date for display
  const formatDayDate = (date) => {
    if (!date) return '';
    
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const dateObj = new Date(date);
    
    if (dateObj.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dateObj.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return format(dateObj, 'EEE, MMM d');
    }
  };

  return (
    <TripContext.Provider value={{
      trips,
      currentTrip,
      currentTripId,
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
      formatDayDate,
      loadDefaultTrip
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  return useContext(TripContext);
}; 