import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import orderReducer, { getOrderThunk } from './orderSlice';

const setupStore = () =>
  configureStore({
    reducer: {
      order: orderReducer
    }
  });

describe('Тестирование редьюсера заказов', () => {
  describe('Тестирование получения данных заказа', () => {
    test('Состояние загрузки при запросе данных заказа', () => {
      const store = setupStore();
      store.dispatch({ type: getOrderThunk.pending.type });
      const state = store.getState();
      expect(state.order.isLoading).toBe(true);
      expect(state.order.error).toBeNull();
    });

    test('Ошибка при запросе данных заказа', () => {
      const store = setupStore();
      const error = 'Заказ не найден';
      store.dispatch({
        type: getOrderThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.order.isLoading).toBe(false);
      expect(state.order.error).toBe(error);
    });

    test('Успешное получение данных заказа', () => {
      const mockedPayload = {
        orders: [
          {
            _id: '66154cd097ede0001d064e7d',
            ingredients: [
              '643d69a5c3f7b9001cfa0941',
              '643d69a5c3f7b9001cfa093c',
              '643d69a5c3f7b9001cfa093c'
            ],
            status: 'done',
            name: 'Краторный био-марсианский бургер',
            createdAt: '2025-06-12T14:12:32.173Z',
            updatedAt: '2025-06-12T14:12:32.790Z',
            number: 37865
          }
        ]
      };

      const store = setupStore();
      store.dispatch({
        type: getOrderThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.order.isLoading).toBe(false);
      expect(state.order.error).toBeNull();
      expect(state.order.order).toEqual(mockedPayload.orders[0]);
    });
  });
});
