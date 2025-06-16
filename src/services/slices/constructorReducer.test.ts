import { expect, test, describe } from '@jest/globals';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp,
  constructorInitialState
} from './constructorSlice';
import type { constructorState } from './constructorSlice';
import { nanoid } from '@reduxjs/toolkit';

jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: jest.fn(() => 'testID123')
}));

describe('Тестирование редьюсера конструктора бургеров', () => {
  const startState: constructorState = {
    ...JSON.parse(JSON.stringify(constructorInitialState)),
    constructorItems: {
      bun: {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        id: 'bun1'
      },
      ingredients: [
        {
          _id: '643d69a5c3f7b9001cfa093f',
          name: 'Мясо бессмертных моллюсков Protostomia',
          type: 'main',
          proteins: 433,
          fat: 244,
          carbohydrates: 33,
          calories: 420,
          price: 1337,
          image: 'https://code.s3.yandex.net/react/code/meat-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/meat-02-large.png',
          __v: 0
        },
        {
          _id: '643d69a5c3f7b9001cfa0944',
          name: 'Соус традиционный галактический',
          type: 'sauce',
          proteins: 42,
          fat: 24,
          carbohydrates: 42,
          calories: 99,
          price: 15,
          image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/sauce-03-large.png',
          __v: 0
        }
      ]
    }
  };

  test('Добавление нового ингредиента в конструктор', () => {
    const ingredient = {
      _id: '643d69a5c3f7b9001cfa0946',
      name: 'Хрустящие минеральные кольца',
      type: 'main',
      proteins: 808,
      fat: 689,
      carbohydrates: 609,
      calories: 986,
      price: 300,
      image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
      image_mobile:
        'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
      image_large:
        'https://code.s3.yandex.net/react/code/mineral_rings-large.png',
      __v: 0
    };

    const endState = {
      ...startState,
      constructorItems: {
        ...startState.constructorItems,
        ingredients: [
          ...startState.constructorItems.ingredients,
          { ...ingredient, id: 'testID123' }
        ]
      }
    };

    const newState = constructorReducer(startState, addIngredient(ingredient));
    expect(nanoid).toHaveBeenCalledTimes(1);
    expect(newState).toEqual(endState);
  });

  test('Удаление ингредиента из конструктора', () => {
    const ingredientId = 'ing2';
    const endState = {
      ...startState,
      constructorItems: {
        ...startState.constructorItems,
        ingredients: startState.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== ingredientId
        )
      }
    };

    const newState = constructorReducer(
      startState,
      removeIngredient(ingredientId)
    );
    expect(newState).toEqual(endState);
  });

  describe('Изменение порядка ингредиентов', () => {
    test('Перемещение ингредиента вверх', () => {
      const ingredientIndex = 1;
      const endState = JSON.parse(JSON.stringify(startState));
      [
        endState.constructorItems.ingredients[ingredientIndex],
        endState.constructorItems.ingredients[ingredientIndex - 1]
      ] = [
        endState.constructorItems.ingredients[ingredientIndex - 1],
        endState.constructorItems.ingredients[ingredientIndex]
      ];

      const newState = constructorReducer(
        startState,
        moveIngredientUp(ingredientIndex)
      );
      expect(newState).toEqual(endState);
    });

    test('Перемещение ингредиента вниз', () => {
      const ingredientIndex = 0;
      const endState = JSON.parse(JSON.stringify(startState));
      [
        endState.constructorItems.ingredients[ingredientIndex],
        endState.constructorItems.ingredients[ingredientIndex + 1]
      ] = [
        endState.constructorItems.ingredients[ingredientIndex + 1],
        endState.constructorItems.ingredients[ingredientIndex]
      ];

      const newState = constructorReducer(
        startState,
        moveIngredientDown(ingredientIndex)
      );
      expect(newState).toEqual(endState);
    });
  });
});
