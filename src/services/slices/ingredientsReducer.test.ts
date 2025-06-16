import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { ingredientsReducer, getIngredientsThunk } from './ingredientsSlice';
const setupStore = () =>
  configureStore({
    reducer: {
      ingredients: ingredientsReducer
    }
  });

describe('Тестирование редьюсера ингредиентов', () => {
  describe('Тестирование получения списка ингредиентов', () => {
    test('Состояние загрузки при запросе ингредиентов', () => {
      const store = setupStore();
      store.dispatch({ type: getIngredientsThunk.pending.type });
      const state = store.getState();
      expect(state.ingredients.isLoading).toBe(true);
      expect(state.ingredients.error).toBeNull();
    });

    test('Ошибка при запросе ингредиентов', () => {
      const store = setupStore();
      const error = 'Ошибка сервера';
      store.dispatch({
        type: getIngredientsThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.ingredients.isLoading).toBe(false);
      expect(state.ingredients.error).toBe(error);
    });

    test('Успешное получение списка ингредиентов', () => {
      const mockedPayload = [
        {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
          __v: 0
        },
        {
          _id: '643d69a5c3f7b9001cfa0940',
          name: 'Говяжий метеорит (отбивная)',
          type: 'main',
          proteins: 800,
          fat: 800,
          carbohydrates: 300,
          calories: 2674,
          price: 3000,
          image: 'https://code.s3.yandex.net/react/code/meat-04.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/meat-04-large.png',
          __v: 0
        }
      ];

      const store = setupStore();
      store.dispatch({
        type: getIngredientsThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.ingredients.isLoading).toBe(false);
      expect(state.ingredients.error).toBeNull();
      expect(state.ingredients.ingredients).toEqual(mockedPayload);
    });
  });
});
