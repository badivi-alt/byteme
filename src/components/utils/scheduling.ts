import { format, addDays, isWithinInterval, startOfDay } from "date-fns";
import { User } from "@/entities/User";

// Helper to check if a date is a valid workday and not a vacation day
const isEligibleDay = (date: Date, workDays: string[], vacationRanges: Array<{ start: string; end: string }> = []) => {
  const dayName = format(date, 'EEE');
  if (!workDays.includes(dayName)) {
    return false; // Not a workday
  }

  const checkDate = startOfDay(date);
  for (const vacation of vacationRanges) {
    if (isWithinInterval(checkDate, { 
      start: startOfDay(new Date(vacation.start)), 
      end: startOfDay(new Date(vacation.end)) 
    })) {
      return false; // It's a vacation day
    }
  }
  return true;
};

// Finds the next available date for scheduling, starting from a given date
export const getNextAvailableDate = (startDate: Date | string, user: User): Date => {
  let currentDate = startOfDay(new Date(startDate));
  const workDays = user.work_days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const vacationRanges = user.vacation_ranges || [];

  // Ensure we don't schedule in the past
  const today = startOfDay(new Date());
  if (currentDate < today) {
    currentDate = today;
  }

  // Find the next eligible day
  while (!isEligibleDay(currentDate, workDays, vacationRanges)) {
    currentDate = addDays(currentDate, 1);
  }

  return currentDate;
};
