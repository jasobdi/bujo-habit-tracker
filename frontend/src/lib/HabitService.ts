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
    const dateKey = date.toLocaleDateString('sv-SE');

    // check if date is before start_date
    if (habit.start_date && new Date(habit.start_date) > date) return false;

    // chef if date is after end_date (if set)
    if (habit.end_date && new Date(habit.end_date) < date) return false;

    // additionally: check active_dates
    if (habit.active_dates && Array.isArray(habit.active_dates)) {
      return habit.active_dates.includes(dateKey);
    }

    // check daily habits
    if (habit.frequency === 'daily') {
      return true; // Daily habits must always be done
    }

    // check weekly habits (without custom_days)
    if (habit.frequency === 'weekly' && (!habit.custom_days || habit.custom_days.length === 0)) {
      const diffInDays = Math.floor(
        (date.getTime() - new Date(habit.start_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffInDays % (7 * habit.repeat_interval) === 0;
    }

    // check monthly habits
    if (habit.frequency === 'monthly') {
      const start = new Date(habit.start_date);
      const monthsDiff = date.getMonth() - start.getMonth() + 12 * (date.getFullYear() - start.getFullYear());
      return monthsDiff % habit.repeat_interval === 0 && date.getDate() === start.getDate();
    }

    // check custom_days habits as fallback (in case active_dates is not set)
    // 7. Prüfe custom_days Habits als Fallback (wenn active_dates nicht vorhanden)
  if (habit.custom_days && habit.custom_days.length > 0) {
    return habit.custom_days.includes(this.mapDay(date.getDay()));
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
    const isCompleted = completions.some(
      (c) => c.habit_id === habit.id && this.isSameDay(new Date(c.date), dueDate)
    );

    if (isCompleted) {
      console.log(`✅ Completed habit ${habit.title} on ${dueDate.toLocaleDateString('sv-SE')}`);
    } else {
      console.log(`❌ NOT completed habit ${habit.title} on ${dueDate.toLocaleDateString('sv-SE')}`);
    }
    return isCompleted;
  }

  /**
   * checks if all habits of a specific date are completed
   * @param habits
   * @param completions
   * @param date (optional) - defaults to today
   * @returns
   */
  static areAllHabitsOfDateCompleted(habits: Habit[], completions: HabitCompletion[], date = new Date()): boolean {
    const dueHabits = habits.filter(h => this.mustHabitBeDoneOnDate(h, date));
    return dueHabits.length > 0 && dueHabits.every(h => this.isHabitCompleted(h, completions, date));
  }

  private static mustCustomHabitBeDoneOnDateCheck(habit: Habit, date: Date): boolean {
    if (!habit.repeat_interval || !habit.custom_days || habit.custom_days.length === 0) {
      return false;
    }

    return habit.custom_days.some((day) => {
      const dayNumber = this.mapDay(day);
      // if (dayNumber === undefined) return false;

      return (
        dayNumber !== undefined &&
        date.getDay() === dayNumber &&
        this.getDifferenceOfDatesInDays(new Date(habit.start_date), date) % habit.repeat_interval === 0
      );
    });
  }

  private static isSameDay(date1: Date, date2: Date): boolean {
  return date1.toLocaleDateString('sv-SE') === date2.toLocaleDateString('sv-SE');
}

    // date1.getMonth() === date2.getMonth() &&
    // date1.getDate() === date2.getDate();
  
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
