import { TestBed } from '@angular/core/testing';
import { MealsService } from './meals.service';

describe('meal service', () => {
  let mealsService: MealsService;
  beforeEach(() => {
    const mealServiceSpy = jasmine.createSpyObj('MealFetchService');
    TestBed.configureTestingModule({
      providers: [MealsService],
    });

    mealsService = TestBed.inject(MealsService);
  });

  it('should inject both services', () => {
    expect(mealsService).toBeTruthy();
  });

  it('should call dispatch patch meal from the store');
});
