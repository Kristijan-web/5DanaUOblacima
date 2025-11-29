interface WorkingHour {
  meal: string;
  from: string;
  to: string;
}

interface TimeSlot {
  date: string;
  time: string;
  meal: string;
}

/**
 * Convert "HH:MM" time string to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to "HH:MM" string
 */
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

/**
 * Format date to "YYYY-MM-DD" string
 */
function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Find which meal a time slot belongs to based on working hours
 * Returns null if the slot doesn't fall within any working hour
 */
function findMealForSlot(
  slotMinutes: number,
  workingHours: WorkingHour[]
): string | null {
  for (const wh of workingHours) {
    const fromMinutes = timeToMinutes(wh.from);
    const toMinutes = timeToMinutes(wh.to);

    // Slot is valid if it starts within the working hour range
    if (slotMinutes >= fromMinutes && slotMinutes < toMinutes) {
      return wh.meal;
    }
  }
  return null;
}

/**
 * Generate time slots for a canteen based on date range, time range, and working hours
 *
 * @param startDate - Start date in "YYYY-MM-DD" format
 * @param endDate - End date in "YYYY-MM-DD" format
 * @param startTime - Start time in "HH:MM" format
 * @param endTime - End time in "HH:MM" format
 * @param duration - Duration in minutes (30 or 60)
 * @param workingHours - Array of working hour objects with meal, from, to
 * @returns Array of time slots with date, time, and meal
 */
export function generateTimeSlots(
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  duration: number,
  workingHours: WorkingHour[]
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  // Parse dates (UTC)
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Convert times to minutes
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  // Loop through each day
  const currentDate = new Date(start);
  while (currentDate <= end) {
    const dateStr = formatDate(currentDate);

    // Generate slots at 30-minute intervals (both :00 and :30)
    // This applies for both 30 and 60 minute durations
    for (let minutes = startMinutes; minutes < endMinutes; minutes += duration) {
      const timeStr = minutesToTime(minutes);

      // Check if this slot falls within any working hour
      const meal = findMealForSlot(minutes, workingHours);

      if (meal) {
        slots.push({
          date: dateStr,
          time: timeStr,
          meal: meal,
        });
      }
    }

    // Move to next day
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return slots;
}

export default generateTimeSlots;
