import { Pipe, PipeTransform } from '@angular/core';
import { Meal, MealType } from '../../meals/meal.model';

export interface MealFilterOptions {
  mealType: MealType | undefined;
  nutritionFacts: {
    calories: {
      min: number | undefined;
      max: number | undefined;
    };
    protein: {
      min: number | undefined;
      max: number | undefined;
    };
    fats: {
      min: number | undefined;
      max: number | undefined;
    };
    carbohydrates: {
      min: number | undefined;
      max: number | undefined;
    };
    vitamins: string[];
  };
}

@Pipe({
  name: 'mealFilter',
  standalone: true,
})
export class MealFilterPipe implements PipeTransform {
  transform(meals: Meal[], filter: MealFilterOptions): Meal[] {
    if (!filter) return meals;

    return meals.filter((meal) => {
      const facts = meal.nutritionFacts;

      const inRange = (
        value: number,
        range?: { min?: number; max?: number }
      ) => {
        if (!range) return true;
        if (range.min != null && value < range.min) return false;
        if (range.max != null && value > range.max) return false;
        return true;
      };

      return (
        (!filter.mealType ||
          filter.mealType === MealType.ALL ||
          meal.type === filter.mealType) &&
        inRange(facts.calories, filter.nutritionFacts.calories) &&
        inRange(facts.protein, filter.nutritionFacts.protein) &&
        inRange(facts.fats, filter.nutritionFacts.fats) &&
        inRange(facts.carbohydrates, filter.nutritionFacts.carbohydrates) &&
        (!filter.nutritionFacts.vitamins.length ||
          filter.nutritionFacts.vitamins.every(
            (v) => facts.vitamins.includes(v) && v !== ''
          ))
      );
    });
  }
}
