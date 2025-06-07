import { Component, Input } from '@angular/core';
import { Meal } from '../../meal.model';

@Component({
  selector: 'app-meal-item',
  imports: [],
  templateUrl: './meal-item.component.html',
  styleUrl: './meal-item.component.css',
})
export class MealItemComponent {
  @Input({ required: true }) meal!: Meal;
}
