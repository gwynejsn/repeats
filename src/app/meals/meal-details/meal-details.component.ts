import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ConfirmBoxComponent } from '../../reusable-components/confirm-box/confirm-box.component';
import { ShoppingListService } from '../../shopping-list/shopping-list.service';
import { Meal } from '../meal.model';
import { MealsService } from '../meals.service';
import { selectMealSelected } from '../state/meals.selectors';

@Component({
  selector: 'app-meal-details',
  imports: [CommonModule, RouterModule, ConfirmBoxComponent],
  templateUrl: './meal-details.component.html',
  styleUrl: './meal-details.component.css',
})
export class MealDetailsComponent implements OnInit {
  private mealsService = inject(MealsService);
  private router = inject(Router);
  private shoppingListService = inject(ShoppingListService);
  private store$ = inject(Store);
  mealSelected!: Meal | null;
  confirmDeleteDiv = false;

  ngOnInit(): void {
    this.store$
      .pipe(select(selectMealSelected))
      .subscribe((mealSelected) => (this.mealSelected = mealSelected));
  }

  addToShoppingList() {
    this.mealSelected?.ingredients.forEach((i) =>
      this.shoppingListService.addToUserShoppingList(
        i.ingredient.name,
        i.quantity
      )
    );
  }

  confirmDeleteMeal(continueDelete: boolean) {
    continueDelete ? this.deleteMeal() : (this.confirmDeleteDiv = false);
  }

  deleteMeal() {
    this.mealsService.deleteMeal(this.mealSelected?.name!);
    this.router.navigate(['/meals']);
  }
}
