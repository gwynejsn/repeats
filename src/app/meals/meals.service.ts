import { inject, Injectable } from '@angular/core';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Meal } from './meal.model';

@Injectable({
  providedIn: 'root',
})
export class MealsService {
  private shoppingListService = inject(ShoppingListService);

  // Meals *will come from db in the future
  grilledChickenMeal = new Meal(
    'Grilled Chicken with Quinoa',
    'Lunch',
    'https://www.onceuponachef.com/images/2020/05/best-grilled-chicken-scaled.jpg',
    'A healthy grilled chicken served with quinoa and olive oil.',
    {
      calories: 450,
      protein: 40,
      fats: 15,
      carbohydrates: 30,
      vitamins: ['B6', 'C'],
    },
    [
      this.shoppingListService.chicken,
      this.shoppingListService.quinoa,
      this.shoppingListService.oliveOil,
    ]
  );

  salmonMeal = new Meal(
    'Lemon Garlic Salmon',
    'Dinner',
    'https://www.themediterraneandish.com/wp-content/uploads/2024/09/TMD-Baked-Lemon-Garlic-Salmon-Leads-03-Vertical.jpg',
    'Baked salmon fillet with lemon and steamed broccoli.',
    {
      calories: 520,
      protein: 45,
      fats: 20,
      carbohydrates: 10,
      vitamins: ['D', 'B12', 'C'],
    },
    [
      this.shoppingListService.salmon,
      this.shoppingListService.broccoli,
      this.shoppingListService.lemon,
    ]
  );

  oatmealMeal = new Meal(
    'Oatmeal with Honey & Almond Milk',
    'Breakfast',
    'https://www.hauteandhealthyliving.com/wp-content/uploads/2022/04/best-creamy-oatmeal-with-almond-milk.jpg',
    'Warm oatmeal served with almond milk and honey.',
    {
      calories: 300,
      protein: 10,
      fats: 8,
      carbohydrates: 50,
      vitamins: ['E', 'B1'],
    },
    [
      this.shoppingListService.oats,
      this.shoppingListService.almondMilk,
      this.shoppingListService.honey,
    ]
  );

  getAllMeals() {
    return [this.grilledChickenMeal, this.salmonMeal, this.oatmealMeal];
  }

  getMeal(name: string) {
    return this.getAllMeals().find((meal) => meal.getName() === name);
  }
}
