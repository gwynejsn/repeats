import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MealFilterOptions } from '../../../shared/pipes/meal-filter.pipe';
import { MealType } from '../../meal.model';
import { MealFilterService } from './meal-filter.service';

@Component({
  selector: 'app-meal-filter',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './meal-filter.component.html',
  styleUrl: './meal-filter.component.css',
})
export class MealFilterComponent {
  private fb = inject(FormBuilder);
  private mealFilterService = inject(MealFilterService);
  mealTypes = Object.values(MealType);

  mealFilterOptions = this.mealFilterService.mealFilterOptions;

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

  closeFilters() {
    this.mealFilterService.filtersAdded = false;
  }

  onSubmitFilters() {
    // remove empty vitamins
    for (let i = this.vitamins.length - 1; i >= 0; i--) {
      if (this.vitamins.at(i)?.value.trim() === '') {
        this.vitamins.removeAt(i);
      }
    }

    this.mealFilterService.mealFilterOptions = this.filters
      .value as MealFilterOptions;
    this.closeFilters();
  }
}
