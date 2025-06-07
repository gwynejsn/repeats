import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Meal } from '../meal.model';
import { MealsService } from '../meals.service';

@Component({
  selector: 'app-meal-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './meal-details.component.html',
  styleUrl: './meal-details.component.css',
})
export class MealDetailsComponent implements OnInit {
  private mealsService = inject(MealsService);
  private activatedRoute = inject(ActivatedRoute);
  mealSelected: Meal | undefined;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.mealSelected = this.mealsService.getMeal(param['meal-name']);
    });
  }
}
