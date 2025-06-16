import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export interface IngredientsState {
  isLoading: boolean;
  ingredients: TIngredient[];
  error: string | null;
}

export const initialState: IngredientsState = {
  isLoading: false,
  ingredients: [],
  error: null
};

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/get',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsStateSelector: (state: IngredientsState) => state,
    getIngredientsSelector: (state: IngredientsState) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state: IngredientsState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getIngredientsThunk.rejected,
        (state: IngredientsState, { error }) => {
          state.isLoading = false;
          state.error = error.message as string;
        }
      )
      .addCase(
        getIngredientsThunk.fulfilled,
        (state: IngredientsState, { payload }) => {
          state.isLoading = false;
          state.error = null;
          state.ingredients = payload;
        }
      );
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
export const { getIngredientsStateSelector, getIngredientsSelector } =
  ingredientsSlice.selectors;
