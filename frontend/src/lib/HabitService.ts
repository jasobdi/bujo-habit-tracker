import { Habit } from '@/types/habit';
import { HabitCompletion } from './fetch/getHabitCompletionsByMonth';

export class HabitService {
  /**
   * Checks if a habit must be done on a specific date.
   * @param habit
   * @param date (optional) - defaults to today
   * @returns boolean
   */
  static mustHabitBeDoneOnDate(habit: Habit, date: Date = new Date()): boolean {
    return !!habit.active_dates && habit.active_dates.some(activeDate => this.isSameDay(new Date(activeDate), date));
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

  private static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

}
