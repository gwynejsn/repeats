import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Meal } from '../meal.model';
import { MealsService } from '../meals.service';
import { MealItemComponent } from './meal-item/meal-item.component';

@Component({
  selector: 'app-meal-list',
  imports: [MealItemComponent, CommonModule, RouterModule],
  templateUrl: './meal-list.component.html',
  styleUrl: './meal-list.component.css',
})
export class MealListComponent implements OnInit {
  private mealsService = inject(MealsService);

  allMeals: Meal[] | undefined;

  ngOnInit(): void {
    this.mealsService.getAllMeals().subscribe((subscription) => {
      this.allMeals = subscription;
    });
  }
}
