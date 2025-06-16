import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

export const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const getFeedThunk = createAsyncThunk('feed/getFeed', getFeedsApi);
export const getOrdersThunk = createAsyncThunk('feed/getOrders', getOrdersApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedStateSelector: (state) => state,
    getOrdersSelector: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.orders = payload.orders;
        state.total = payload.total;
        state.totalToday = payload.totalToday;
      })
      .addCase(getFeedThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message || 'Feed loading failed';
      })
      .addCase(getOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrdersThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.orders = payload;
      })
      .addCase(getOrdersThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message || 'Orders loading failed';
      });
  }
});

export const feedReducer = feedSlice.reducer;
export const { getFeedStateSelector, getOrdersSelector } = feedSlice.selectors;
