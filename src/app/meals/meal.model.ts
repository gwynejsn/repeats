import { Ingredient } from '../shopping-list/ingredient.model';

export interface MealIngredient {
  ingredient: Ingredient;
  quantity: number;
}

export enum MealType {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  ALL = 'All',
}

export class Meal {
  constructor(
    private _name: string,
    private _type: MealType,
    private _imgSrc: string,
    private _description: string,
    private _nutritionFacts: {
      calories: number;
      protein: number;
      fats: number;
      carbohydrates: number;
      vitamins: string[];
    },
    private _ingredients: MealIngredient[]
  ) {}

  // Getters
  get name(): string {
    return this._name;
  }

  get type(): MealType {
    return this._type;
  }

  get imgSrc(): string {
    return this._imgSrc;
  }

  get description(): string {
    return this._description;
  }

  get nutritionFacts(): {
    calories: number;
    protein: number;
    fats: number;
    carbohydrates: number;
    vitamins: string[];
  } {
    return this._nutritionFacts;
  }

  get vitamins(): string {
    const vit = this._nutritionFacts.vitamins;
    return vit.length > 0 ? vit.join(', ') : 'None';
  }

  get vitaminsArray(): string[] {
    return this._nutritionFacts.vitamins;
  }

  get ingredients(): MealIngredient[] {
    return this._ingredients;
  }

  get ingredientsNames(): string[] {
    return this._ingredients.map((i) => i.ingredient.name);
  }

  // Setters
  set name(value: string) {
    this._name = value;
  }

  set type(value: MealType) {
    this._type = value;
  }

  set imgSrc(value: string) {
    this._imgSrc = value;
  }

  set description(value: string) {
    this._description = value;
  }

  set nutritionFacts(value: {
    calories: number;
    protein: number;
    fats: number;
    carbohydrates: number;
    vitamins: string[];
  }) {
    this._nutritionFacts = value;
  }

  set ingredients(value: MealIngredient[]) {
    this._ingredients = value;
  }

  static generateEmptyMeal(): Meal {
    return new Meal(
      '',
      MealType.ALL,
      '',
      '',
      {
        calories: 0,
        protein: 0,
        fats: 0,
        carbohydrates: 0,
        vitamins: [],
      },
      []
    );
  }

  toObject(): {
    name: string;
    type: MealType;
    imgSrc: string;
    description: string;
    nutritionFacts: {
      calories: number;
      protein: number;
      fats: number;
      carbohydrates: number;
      vitamins: string[];
    };
    ingredients: MealIngredient[];
  } {
    return {
      name: this._name,
      type: this._type,
      imgSrc: this._imgSrc,
      description: this._description,
      nutritionFacts: this._nutritionFacts,
      ingredients: this._ingredients,
    };
  }
}
