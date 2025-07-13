import { Habit } from "./habit";
import { Category } from "./category";

export interface HabitWithCategories extends Habit {
    categories: Category[];

}
