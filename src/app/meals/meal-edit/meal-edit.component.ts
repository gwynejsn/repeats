import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientValidator } from '../../shared/validators/ingredient.validator';
import { Ingredient } from '../../shopping-list/ingredient.model';
import { ShoppingListFetchService } from '../../shopping-list/shopping-list-fetch.service';
import { Meal, MealIngredient, MealType } from '../meal.model';
import { MealsService } from '../meals.service';

@Component({
  selector: 'app-meal-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meal-edit.component.html',
  styleUrl: './meal-edit.component.css',
})
export class MealEditComponent implements OnInit {
  private mealsService = inject(MealsService);
  private shoppingListFetchService = inject(ShoppingListFetchService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private ingredientValidator = inject(IngredientValidator);
  mealSelected: Meal | undefined;
  mealEdit: FormGroup | undefined;
  previewImgSrc: string | undefined;
  mealTypes = Object.values(MealType);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      const foundMeal = this.mealsService.getMeal(param['meal-name']);
      if (foundMeal) this.mealSelected = foundMeal;
      else this.mealSelected = Meal.generateEmptyMeal();
    });

    this.previewImgSrc = this.mealSelected?.getImgSrc();

    this.mealEdit = this.fb.group({
      imgInfo: this.fb.group({
        imgSrc: [this.mealSelected?.getImgSrc()],
      }),
      details: this.fb.group({
        aboutMeal: this.fb.group({
          name: [this.mealSelected?.getName(), [Validators.required]],
          description: [
            this.mealSelected?.getDescription(),
            [Validators.required],
          ],
          mealType: [this.mealSelected?.getType(), [Validators.required]],
          nutritionFacts: this.fb.group({
            calories: [
              this.mealSelected?.getNutritionFacts().calories,
              [Validators.required],
            ],
            protein: [
              this.mealSelected?.getNutritionFacts().protein,
              [Validators.required],
            ],
            fats: [
              this.mealSelected?.getNutritionFacts().fats,
              [Validators.required],
            ],
            carbohydrates: [
              this.mealSelected?.getNutritionFacts().carbohydrates,
              [Validators.required],
            ],
            vitamins: this.fb.array(
              this.mealSelected
                ?.getVitaminsArray()
                .map((vitamin) => this.fb.control(vitamin)) || []
            ),
          }),
          mealIngredients: this.fb.group({
            ingredients: this.fb.array(
              this.mealSelected
                ?.getIngredientsNames()
                .map((ingredient: string) =>
                  this.fb.control(
                    ingredient,
                    [Validators.required],
                    [this.ingredientValidator.ingredientExistAsync()]
                  )
                ) || []
            ),
            quantities: this.fb.array(
              this.mealSelected
                ?.getIngredients()
                .map((ingredient: MealIngredient) =>
                  this.fb.control(ingredient.quantity)
                ) || []
            ),
          }),
        }),
      }),
    });

    this.mealEdit
      .get('imgInfo.imgSrc')
      ?.valueChanges.subscribe((value) => (this.previewImgSrc = value));
  }

  get imgSrcProvided() {
    return (<FormArray>this.mealEdit?.get('imgInfo.imgSrc')).value.length > 0
      ? true
      : false;
  }

  get vitamins() {
    return this.mealEdit?.get(
      'details.aboutMeal.nutritionFacts.vitamins'
    ) as FormArray;
  }

  get ingredients() {
    return this.mealEdit?.get(
      'details.aboutMeal.mealIngredients.ingredients'
    ) as FormArray;
  }

  get quantities() {
    return this.mealEdit?.get(
      'details.aboutMeal.mealIngredients.quantities'
    ) as FormArray;
  }

  addVitamin() {
    this.vitamins.push(this.fb.control('', [Validators.required]));
  }

  addIngredient() {
    this.ingredients.push(
      this.fb.control(
        '',
        [Validators.required],
        [this.ingredientValidator.ingredientExistAsync()]
      )
    );
    this.quantities.push(this.fb.control(1, [Validators.required]));
  }

  onSubmit() {
    let allIngredients: Ingredient[];
    this.shoppingListFetchService
      .getAllAvailableIngredientsNotUnique()
      .subscribe((ingredients) => (allIngredients = ingredients));
    if (this.mealEdit) {
      const formValue = this.mealEdit.value;

      const quantitiesArr =
        formValue.details.aboutMeal.mealIngredients.quantities;
      const ingredientListFound =
        formValue.details.aboutMeal.mealIngredients.ingredients.map(
          (ingredient: string, index: number) => {
            return {
              ingredient: allIngredients.find((i) =>
                i.stringCompareTo(ingredient)
              ),
              quantity: quantitiesArr[index],
            };
          }
        );

      const updatedMeal = new Meal(
        formValue.details.aboutMeal.name,
        formValue.details.aboutMeal.mealType,
        this.imgSrcProvided
          ? formValue.imgInfo.imgSrc
          : 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
        formValue.details.aboutMeal.description,
        {
          calories: formValue.details.aboutMeal.nutritionFacts.calories,
          protein: formValue.details.aboutMeal.nutritionFacts.protein,
          fats: formValue.details.aboutMeal.nutritionFacts.fats,
          carbohydrates:
            formValue.details.aboutMeal.nutritionFacts.carbohydrates,
          vitamins: formValue.details.aboutMeal.nutritionFacts.vitamins,
        },
        ingredientListFound
      );

      this.mealsService.patchMeal(this.mealSelected?.getName()!, updatedMeal);
      this.router.navigate(['/meals', this.mealSelected?.getName()]);
    }
  }

  cancelEdit() {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }
}
