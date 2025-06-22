import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MealFilterPipe } from '../../shared/pipes/meal-filter.pipe';
import { MealSearchPipe } from '../../shared/pipes/meal-search.pipe';
import { Meal } from '../meal.model';
import { changeMealSelected } from '../state/meals.actions';
import { selectMeals } from '../state/meals.selectors';
import { MealItemComponent } from './meal-item/meal-item.component';
import { MealFilterComponent } from './mealfilter/meal-filter.component';
import { MealFilterService } from './mealfilter/meal-filter.service';

@Component({
  selector: 'app-meal-list',
  standalone: true,
  imports: [
    MealItemComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MealFilterPipe,
    MealSearchPipe,
    AsyncPipe,
    MealFilterComponent,
  ],
  templateUrl: './meal-list.component.html',
  styleUrl: './meal-list.component.css',
})
export class MealListComponent {
  private store$ = inject(Store);
  mealFilterService = inject(MealFilterService);

  searchTerm = '';

  allMeals$: Observable<Meal[]>;

  constructor() {
    this.allMeals$ = this.store$.pipe(select(selectMeals));
  }

  addNewRecipe() {
    this.store$.dispatch(
      changeMealSelected({ newMeal: Meal.generateEmptyMeal() })
    );
  }

  changeSelectedMeal(meal: Meal) {
    this.store$.dispatch(changeMealSelected({ newMeal: meal }));
  }
}
