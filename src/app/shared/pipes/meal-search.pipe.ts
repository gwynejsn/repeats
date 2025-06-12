import { Pipe, PipeTransform } from '@angular/core';
import { Meal } from '../../meals/meal.model';

@Pipe({
  name: 'mealSearch',
})
export class MealSearchPipe implements PipeTransform {
  transform(meals: Meal[], keyword: string): Meal[] {
    let matchingMeals: Meal[] = [];
    meals.forEach((meal) => {
      if (meal.getName().toLowerCase().includes(keyword.toLocaleLowerCase()))
        matchingMeals.push(meal);
    });
    return matchingMeals;
  }
}
