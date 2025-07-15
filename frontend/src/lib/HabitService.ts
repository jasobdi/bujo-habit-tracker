import { Habit, HabitCustomDays } from '@/types/habit';
import { HabitCompletion } from './fetch/getHabitCompletionsByMonth';

export class HabitService {
  private static readonly DATE_FORMAT = 'de-CH'; // Switzerland date format (YYYY-MM-DD)

  public static getDifferenceOfDatesInDays(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.abs(Math.ceil(diffTime / (1000 * 60 * 60 * 24))); // Convert milliseconds to days
  }
  /**
   * Checks if a habit is active on a specific date.
   * @param habit
   * @param date (optional) - defaults to today
   * @returns boolean
   */
  static isHabitActiveOnDate(habit: Habit, date: Date = new Date()): boolean {
    return new Date(habit.start_date) <= date
      && (!habit.end_date
        || new Date(habit.end_date) >= date);
  }

  /**
   * Checks if a habit must be done on a specific date.
   * @param habit
   * @param date (optional) - defaults to today
   * @returns boolean
   */
  static mustHabitBeDoneOnDate(habit: Habit, date: Date = new Date()): boolean {
    if (!this.isHabitActiveOnDate(habit, date)) {
      return false; // Habit is not active on this date
    }

    if (habit.frequency === 'daily') {
      return true; // Daily habits must always be done
    }
    if (habit.frequency === 'weekly') {
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const habitsDayOfWeek = new Date(habit.start_date).getDay();
      return habitsDayOfWeek === dayOfWeek; // Check if the habit's start day matches today's day
    }
    if (habit.frequency === 'monthly') {
      const dayOfMonth = date.getDate(); // 1-31
      const habitDayOfMonth = new Date(habit.start_date).getDate();
      // if monthly is on eg. the 31st, then on months with less than 31 days, it should not be done
      return habitDayOfMonth === dayOfMonth; // Check if the habit's start day matches today's day of month
    }
    if (habit.frequency === 'custom') {
      return this.mustCustomHabitBeDoneOnDateCheck(habit, date); // Custom logic for custom habits
    }

    return false; // If frequency is not recognized, assume it doesn't need to be done
  }

  /**
   * Checks if a habit is completed on a specific date.
   * @param habit
   * @param completions
   * @returns
   */
  static isHabitCompleted(habit: Habit, completions: HabitCompletion[], dueDate: Date): boolean {
    const matchingCompletions = completions.filter((completion) => completion.habit_id === habit.id);
    if (matchingCompletions.length === 0) {
      return false; // No completions found for this habit  
    }
    if (this.mustHabitBeDoneOnDate(habit, dueDate)) {
      return matchingCompletions.some((completion) => {
        if (this.isSameDay(new Date(completion.date), dueDate)) {
          return true; // Habit is completed on this date
        }
      });
    }
    return false; // No matching completion found
  }

  /**
   * checks if all habits of a specific date are completed
   * @param habits
   * @param completions
   * @param date (optional) - defaults to today
   * @returns
   */
  static areAllHabitsOfDateCompleted(habits: Habit[], completions: HabitCompletion[], date = new Date()): boolean {
    return habits.filter(h => this.mustHabitBeDoneOnDate(h, date)).every((habit) => this.isHabitCompleted(habit, completions, date));
  }

  private static mustCustomHabitBeDoneOnDateCheck(habit: Habit, date: Date): boolean {
    if (!habit.repeat_interval || !habit.custom_days || habit.custom_days.length === 0) {
      return false;
    }

    return habit.custom_days.some((day) => {
      const dayNumber = this.mapDay(day);
      if (dayNumber === undefined) return false;

      return (
        date.getDay() === dayNumber &&
        this.getDifferenceOfDatesInDays(new Date(habit.start_date), date) % habit.repeat_interval === 0
      );
    });
  }

  private static isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}
  
  private static mapDay(day: HabitCustomDays): number;
  private static mapDay(day: number): HabitCustomDays;
  private static mapDay(day: HabitCustomDays | number): HabitCustomDays | number | undefined {
  if (typeof day === 'number') {
    switch (day) {
      case 0:
        return 'sunday';
      case 1:
        return 'monday';
      case 2:
        return 'tuesday';
      case 3:
        return 'wednesday';
      case 4:
        return 'thursday';
      case 5:
        return 'friday';
      case 6:
        return 'saturday';
      default:
        return undefined; // Invalid number, return undefined
    }
  } else {
    switch (day) {
      case 'monday':
        return 1;
      case 'tuesday':
        return 2;
      case 'wednesday':
        return 3;
      case 'thursday':
        return 4;
      case 'friday':
        return 5;
      case 'saturday':
        return 6;
      case 'sunday':
        return 0;
      default:
        return undefined; // Invalid number, return undefined
    }
  }
}
}
