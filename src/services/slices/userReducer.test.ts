import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
  updateUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  getUserThunk
} from './userSlice';

const setupStore = () =>
  configureStore({
    reducer: {
      user: userReducer
    }
  });

describe('Тестирование редьюсера пользователя', () => {
  const mockUser = {
    email: 'nikitoss@gmail.com',
    name: 'Nikita'
  };

  describe('Тестирование входа пользователя', () => {
    test('Состояние загрузки при входе', () => {
      const store = setupStore();
      store.dispatch({ type: loginUserThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBe(true);
      expect(state.user.error).toBeNull();
    });

    test('Ошибка при входе', () => {
      const store = setupStore();
      const error = 'Неверные учетные данные';
      store.dispatch({
        type: loginUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBe(error);
    });

    test('Успешный вход пользователя', () => {
      const mockedPayload = {
        accessToken: 'testAccessToken',
        refreshToken: 'testRefreshToken',
        user: mockUser
      };

      const store = setupStore();
      store.dispatch({
        type: loginUserThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBeNull();
      expect(state.user.user).toEqual(mockUser);
      expect(state.user.isAuthorized).toBe(true);
    });
  });

  describe('Тестирование регистрации пользователя', () => {
    test('Состояние загрузки при регистрации', () => {
      const store = setupStore();
      store.dispatch({ type: registerUserThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBe(true);
      expect(state.user.error).toBeNull();
    });

    test('Ошибка при регистрации', () => {
      const store = setupStore();
      const error = 'Пользователь уже существует';
      store.dispatch({
        type: registerUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBe(error);
    });

    test('Успешная регистрация пользователя', () => {
      const mockedPayload = {
        accessToken: 'testAccessToken',
        refreshToken: 'testRefreshToken',
        user: mockUser
      };

      const store = setupStore();
      store.dispatch({
        type: registerUserThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBeNull();
      expect(state.user.user).toEqual(mockUser);
      expect(state.user.isAuthorized).toBe(true);
    });
  });

  describe('Тестирование выхода пользователя', () => {
    test('Состояние загрузки при выходе', () => {
      const store = setupStore();
      store.dispatch({ type: logoutUserThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBe(true);
      expect(state.user.error).toBeNull();
    });

    test('Ошибка при выходе', () => {
      const store = setupStore();
      const error = 'Ошибка сервера';
      store.dispatch({
        type: logoutUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBe(error);
    });

    test('Успешный выход пользователя', () => {
      const mockedPayload = {
        message: 'Успешный выход'
      };

      const store = setupStore();
      store.dispatch({
        type: logoutUserThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBeNull();
      expect(state.user.user).toBeNull();
      expect(state.user.isAuthorized).toBe(false);
    });
  });

  describe('Тестирование обновления данных пользователя', () => {
    test('Состояние загрузки при обновлении', () => {
      const store = setupStore();
      store.dispatch({ type: updateUserThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBe(true);
      expect(state.user.error).toBeNull();
    });

    test('Ошибка при обновлении', () => {
      const store = setupStore();
      const error = 'Недостаточно прав';
      store.dispatch({
        type: updateUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBe(error);
    });

    test('Успешное обновление данных пользователя', () => {
      const mockedPayload = {
        user: {
          email: 'new@email.com',
          name: 'New Name'
        }
      };

      const store = setupStore();
      store.dispatch({
        type: updateUserThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBeNull();
      expect(state.user.user).toEqual(mockedPayload.user);
      expect(state.user.isAuthorized).toBe(true);
    });
  });

  describe('Тестирование восстановления пароля', () => {
    test('Состояние загрузки при запросе восстановления', () => {
      const store = setupStore();
      store.dispatch({ type: forgotPasswordThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBe(true);
      expect(state.user.error).toBeNull();
    });

    test('Ошибка при восстановлении пароля', () => {
      const store = setupStore();
      const error = 'Пользователь не найден';
      store.dispatch({
        type: forgotPasswordThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBe(error);
    });

    test('Успешный запрос восстановления пароля', () => {
      const mockedPayload = {
        message: 'Письмо отправлено'
      };

      const store = setupStore();
      store.dispatch({
        type: forgotPasswordThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBeNull();
    });
  });

  describe('Тестирование сброса пароля', () => {
    test('Состояние загрузки при сбросе пароля', () => {
      const store = setupStore();
      store.dispatch({ type: resetPasswordThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBe(true);
      expect(state.user.error).toBeNull();
    });

    test('Ошибка при сбросе пароля', () => {
      const store = setupStore();
      const error = 'Неверный токен';
      store.dispatch({
        type: resetPasswordThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBe(error);
    });

    test('Успешный сброс пароля', () => {
      const mockedPayload = {
        message: 'Пароль успешно изменен'
      };

      const store = setupStore();
      store.dispatch({
        type: resetPasswordThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBeNull();
    });
  });

  describe('Тестирование получения данных пользователя', () => {
    test('Состояние загрузки при запросе данных', () => {
      const store = setupStore();
      store.dispatch({ type: getUserThunk.pending.type });
      const state = store.getState();
      expect(state.user.isLoading).toBe(true);
      expect(state.user.error).toBeNull();
    });

    test('Ошибка при получении данных', () => {
      const store = setupStore();
      const error = 'Требуется авторизация';
      store.dispatch({
        type: getUserThunk.rejected.type,
        error: { message: error }
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBe(error);
    });

    test('Успешное получение данных пользователя', () => {
      const mockedPayload = {
        user: mockUser
      };

      const store = setupStore();
      store.dispatch({
        type: getUserThunk.fulfilled.type,
        payload: mockedPayload
      });
      const state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBeNull();
      expect(state.user.user).toEqual(mockUser);
      expect(state.user.isAuthorized).toBe(true);
    });
  });
});
