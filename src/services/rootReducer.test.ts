import { expect, test, describe } from '@jest/globals';
import { rootReducer } from '@store';
import {
  userInitialState,
  orderInitialState,
  ingredientsInitialState,
  feedInitialState,
  constructorInitialState
} from '@slices';

describe('Проверка корневого редьюсера', () => {
  const initialState = {
    user: { ...userInitialState },
    feed: { ...feedInitialState },
    order: { ...orderInitialState },
    ingredients: { ...ingredientsInitialState },
    constructorbg: { ...constructorInitialState }
  };

  test('Проверка инициализации корневого редьюсера', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const newState = rootReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });
});
