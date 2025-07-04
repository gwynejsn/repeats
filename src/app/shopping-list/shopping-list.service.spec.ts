import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Ingredient } from './ingredient.model';
import {
  ShoppingListFetchService,
  UniqueIngredientListItem,
} from './shopping-list-fetch.service';
import {
  IngredientListItem,
  ShoppingListService,
} from './shopping-list.service';

describe('ShoppingListService', () => {
  let shoppingListFetchService: jasmine.SpyObj<ShoppingListFetchService>;
  let shoppingListService: ShoppingListService;

  const mockIngredients: Ingredient[] = [
    new Ingredient('Tomato', 15, new Date('2025-07-01')),
    new Ingredient('Onion', 10, new Date('2025-07-05')),
    new Ingredient('Garlic', 5, new Date('2025-08-01')),
    new Ingredient('Carrot', 12.5, new Date('2025-07-10')),
    new Ingredient('Cabbage', 20, new Date('2025-06-30')),
  ];

  const mockShoppingList: UniqueIngredientListItem[] = mockIngredients.map(
    (mockIngredient, index) => ({
      id: (index * 1000).toString(),
      listItem: {
        ingredient: mockIngredient,
        quantity: (index + 1) * 2,
      },
    })
  );

  const mockShoppingListNotUnique: IngredientListItem[] = mockIngredients.map(
    (mockIngredient, index) => ({
      ingredient: mockIngredient,
      quantity: (index + 1) * 2,
    })
  );

  beforeEach(() => {
    const fetchServiceSpy = jasmine.createSpyObj('ShoppingListFetchService', [
      'getAllFromShoppingList',
      'patchIngredientToShoppingList',
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ShoppingListService,
        { provide: ShoppingListFetchService, useValue: fetchServiceSpy },
      ],
    });

    shoppingListFetchService = TestBed.inject(
      ShoppingListFetchService
    ) as jasmine.SpyObj<ShoppingListFetchService>;

    shoppingListFetchService.getAllFromShoppingList.and.returnValue(
      of(mockShoppingList)
    );

    shoppingListFetchService.patchIngredientToShoppingList.and.returnValue(
      of(new HttpResponse())
    );

    shoppingListService = TestBed.inject(ShoppingListService);
  });

  it('should inject both services', () => {
    expect(shoppingListService).toBeTruthy();
    expect(shoppingListFetchService).toBeTruthy();
  });

  it('should return an observable of userShoppingList$', (done: DoneFn) => {
    shoppingListService.getAllUserShoppingList().subscribe((value) => {
      expect(value).toEqual(mockShoppingListNotUnique);
      done();
    });
  });

  it('should update userShoppingList$ when refetchShoppingList is called', (done: DoneFn) => {
    shoppingListFetchService.getAllFromShoppingList().subscribe((value) => {
      expect(value).toEqual(mockShoppingList);
      done();
    });

    shoppingListService.refetchShoppingList();
  });

  it('should remove 3 onions and patch the quantity', (done: DoneFn) => {
    const onionItem = mockShoppingList.find(
      (item) => item.listItem.ingredient.name === 'Onion'
    )!;
    const expectedUpdatedQuantity = onionItem.listItem.quantity - 3;

    // Spy on refetchShoppingList
    spyOn(shoppingListService, 'refetchShoppingList');

    // Run the method
    shoppingListService.removeFromUserShoppingList('Onion', 3);

    // Expect patch to be called
    expect(
      shoppingListFetchService.patchIngredientToShoppingList
    ).toHaveBeenCalledWith(onionItem.id, {
      ingredient: onionItem.listItem.ingredient,
      quantity: expectedUpdatedQuantity,
    });

    // Expect refetch to be called after patch
    expect(shoppingListService.refetchShoppingList).toHaveBeenCalled();

    done();
  });
});
