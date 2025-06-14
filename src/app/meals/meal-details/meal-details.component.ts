import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmBoxComponent } from '../../reusable-components/confirm-box/confirm-box.component';
import { ShoppingListService } from '../../shopping-list/shopping-list.service';
import { Meal } from '../meal.model';
import { MealsService } from '../meals.service';

@Component({
  selector: 'app-meal-details',
  imports: [CommonModule, RouterModule, ConfirmBoxComponent],
  templateUrl: './meal-details.component.html',
  styleUrl: './meal-details.component.css',
})
export class MealDetailsComponent implements OnInit {
  private mealsService = inject(MealsService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private shoppingListService = inject(ShoppingListService);
  mealSelected: Meal | undefined;
  confirmDeleteDiv = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.mealSelected = this.mealsService.getMeal(param['meal-name']);
    });
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
