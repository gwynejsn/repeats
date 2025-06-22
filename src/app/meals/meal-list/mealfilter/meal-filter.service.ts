import { Injectable } from '@angular/core';
import { MealFilterOptions } from '../../../shared/pipes/meal-filter.pipe';
import { MealType } from '../../meal.model';

@Injectable({ providedIn: 'root' })
export class MealFilterService {
  mealFilterOptions: MealFilterOptions = {
    mealType: MealType.ALL,
    nutritionFacts: {
      calories: { min: undefined, max: undefined },
      protein: { min: undefined, max: undefined },
      fats: { min: undefined, max: undefined },
      carbohydrates: { min: undefined, max: undefined },
      vitamins: [],
    },
  };

  filtersAdded = false;
}
