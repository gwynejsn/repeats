import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MealListComponent } from './meal-list/meal-list.component';

@Component({
  selector: 'app-meals',
  imports: [MealListComponent, RouterOutlet, CommonModule],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.css',
})
export class MealsComponent {
  private activatedRouter = inject(ActivatedRoute);
}
