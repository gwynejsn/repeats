import { Pipe, PipeTransform } from '@angular/core';
import { Meal } from '../../meals/meal.model';

@Pipe({
  name: 'mealSearch',
})
export class MealSearchPipe implements PipeTransform {
  transform(meals: Meal[] | null, keyword: string): Meal[] {
    if (!meals) return [];
    let matchingMeals: Meal[] = [];
    meals.forEach((meal) => {
      if (meal.name.toLowerCase().includes(keyword.toLocaleLowerCase()))
        matchingMeals.push(meal);
    });
    return matchingMeals;
  }
}
