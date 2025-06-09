import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MealListComponent } from './meal-list/meal-list.component';

@Component({
  selector: 'app-meals',
  imports: [MealListComponent, RouterOutlet, CommonModule],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.css',
})
export class MealsComponent {}
