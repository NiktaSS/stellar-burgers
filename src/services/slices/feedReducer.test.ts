import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { feedReducer, getFeedThunk, getOrdersThunk } from './feedSlice';

const setupStore = () =>
  configureStore({
    reducer: {
      feed: feedReducer
    }
  });

describe('Тестирование редьюсера ленты заказов', () => {
  describe('Тестирование получения общей ленты заказов', () => {
    test('Состояние загрузки при запросе ленты', () => {
      const store = setupStore();
      store.dispatch({ type: getFeedThunk.pending.type });
      const state = store.getState();
      expect(state.feed.isLoading).toBe(true);
      expect(state.feed.error).toBeNull();
    });

    test('Ошибка при запросе ленты', () => {
      const store = setupStore();
      const error = 'Ошибка сети';
      store.dispatch({
        type: getFeedThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.feed.isLoading).toBe(false);
      expect(state.feed.error).toBe(error);
    });

    test('Успешное получение ленты заказов', () => {
      const mockedPayload = {
        orders: [
          {
            _id: '66154cd097ede0001d064e7d',
            ingredients: [
              '643d69a5c3f7b9001cfa0941',
              '643d69a5c3f7b9001cfa093c',
              '643d69a5c3f7b9001cfa0941'
            ],
            status: 'done',
            name: 'Краторный био-марсианский бургер',
            createdAt: '2025-06-12T14:12:32.173Z',
            updatedAt: '2025-06-12T14:12:32.790Z',
            number: 37865
          }
        ],
        total: 100,
        totalToday: 5
      };

      const store = setupStore();
      store.dispatch({
        type: getFeedThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.feed.isLoading).toBe(false);
      expect(state.feed.error).toBeNull();
      expect(state.feed.orders).toEqual(mockedPayload.orders);
      expect(state.feed.total).toBe(100);
      expect(state.feed.totalToday).toBe(5);
    });
  });

  describe('Тестирование получения ленты заказов пользователя', () => {
    test('Состояние загрузки при запросе персональных заказов', () => {
      const store = setupStore();
      store.dispatch({ type: getOrdersThunk.pending.type });
      const state = store.getState();
      expect(state.feed.isLoading).toBe(true);
      expect(state.feed.error).toBeNull();
    });

    test('Ошибка при запросе персональных заказов', () => {
      const store = setupStore();
      const error = 'Ошибка авторизации';
      store.dispatch({
        type: getOrdersThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.feed.isLoading).toBe(false);
      expect(state.feed.error).toBe(error);
    });

    test('Успешное получение персональных заказов', () => {
      const mockedPayload = [
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
      ];

      const store = setupStore();
      store.dispatch({
        type: getOrdersThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.feed.isLoading).toBe(false);
      expect(state.feed.error).toBeNull();
      expect(state.feed.orders).toEqual(mockedPayload);
    });
  });
});
