import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  MealFilterOptions,
  MealFilterPipe,
} from '../../shared/pipes/meal-filter.pipe';
import { MealSearchPipe } from '../../shared/pipes/meal-search.pipe';
import { Meal, MealType } from '../meal.model';
import { MealsService } from '../meals.service';
import { MealItemComponent } from './meal-item/meal-item.component';

@Component({
  selector: 'app-meal-list',
  imports: [
    MealItemComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MealFilterPipe,
    MealSearchPipe,
  ],
  templateUrl: './meal-list.component.html',
  styleUrl: './meal-list.component.css',
})
export class MealListComponent implements OnInit {
  private mealsService = inject(MealsService);
  private fb = inject(FormBuilder);
  filtersAdded = false;
  searchTerm = '';

  allMeals!: Meal[];
  mealTypes = Object.values(MealType);

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

  filters = this.fb.group({
    mealType: this.fb.control(this.mealFilterOptions.mealType),
    nutritionFacts: this.fb.group({
      calories: this.fb.group({
        min: this.fb.control(
          this.mealFilterOptions.nutritionFacts.calories.min
        ),
        max: this.fb.control(
          this.mealFilterOptions.nutritionFacts.calories.max
        ),
      }),
      protein: this.fb.group({
        min: this.fb.control(this.mealFilterOptions.nutritionFacts.protein.min),
        max: this.fb.control(this.mealFilterOptions.nutritionFacts.protein.max),
      }),
      fats: this.fb.group({
        min: this.fb.control(this.mealFilterOptions.nutritionFacts.fats.min),
        max: this.fb.control(this.mealFilterOptions.nutritionFacts.fats.max),
      }),
      carbohydrates: this.fb.group({
        min: this.fb.control(
          this.mealFilterOptions.nutritionFacts.carbohydrates.min
        ),
        max: this.fb.control(
          this.mealFilterOptions.nutritionFacts.carbohydrates.max
        ),
      }),
      vitamins: this.fb.array(this.mealFilterOptions.nutritionFacts.vitamins),
    }),
  });

  clearFilter() {
    this.filters.reset();
    this.filters.patchValue({
      mealType: MealType.ALL,
    });
    this.onSubmitFilters();
  }

  get vitamins() {
    return this.filters.get('nutritionFacts.vitamins') as FormArray;
  }

  addVitaminFilter() {
    this.vitamins.push(this.fb.control(''));
  }

  onSubmitFilters() {
    this.filtersAdded = false;

    // remove empty vitamin fields
    for (let i = this.vitamins.length - 1; i >= 0; i--) {
      if (this.vitamins.at(i)?.value.trim() === '') {
        this.vitamins.removeAt(i);
      }
    }

    this.mealFilterOptions = this.filters.value as MealFilterOptions;
  }

  ngOnInit(): void {
    this.mealsService.getAllMeals().subscribe((subscription) => {
      this.allMeals = subscription.map((uniqueMeal) => uniqueMeal.meal);
      console.log('all meals');
      console.log(this.allMeals);
    });
  }
}
