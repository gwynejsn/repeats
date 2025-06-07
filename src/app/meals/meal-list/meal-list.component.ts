import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MealsService } from '../meals.service';
import { MealItemComponent } from './meal-item/meal-item.component';

@Component({
  selector: 'app-meal-list',
  imports: [MealItemComponent, CommonModule, RouterModule],
  templateUrl: './meal-list.component.html',
  styleUrl: './meal-list.component.css',
})
export class MealListComponent {
  private mealsService = inject(MealsService);

  allMeals = this.mealsService.getAllMeals();
}
