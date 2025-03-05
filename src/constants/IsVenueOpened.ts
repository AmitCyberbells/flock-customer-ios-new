import Venue from '../types/Venue';

const IsVenueOpened = (venue: Venue): boolean => {
  const now = new Date(); // Get the current date and time
  const today = now.toLocaleDateString('en-US', {weekday: 'long'}); // Get today's name (e.g., "Friday")
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`; // Format time as HH:mm
    
  return (
    venue?.opening_hours?.some(hour => {
      //console.log({today}, {currentTime})
      // Get the start and end days and times
      const {start_day, end_day, start_time, end_time} = hour;

      // Case 1: If start and end days are the same (e.g., open and close on the same day)
      if (start_day === end_day) {
        if (today === start_day) {
          return start_time <= currentTime && currentTime <= end_time;
        }
      }

      // Case 2: If the venue opens today and closes tomorrow
      if (start_day === today) {
        return start_time <= currentTime; // Currently open if it's after start_time
      }

      // Case 3: If the venue opened yesterday and closes today
      if (end_day === today) {
        return currentTime <= end_time; // Currently open if it's before end_time
      }

      return false; // Not open in all other cases
    }) || false
  ); // Default to false if no opening hours are defined
};

export default IsVenueOpened;