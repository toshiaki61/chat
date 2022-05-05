import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

export const CARD_FEATURE_KEY = 'card';

/*
 * Update these interfaces according to your requirements.
 */
export interface CardEntity {
  id: number;
}

export interface CardState extends EntityState<CardEntity> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string;
}

export const cardAdapter = createEntityAdapter<CardEntity>();

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(fetchCard())
 * }, [dispatch]);
 * ```
 */
export const fetchCard = createAsyncThunk<CardEntity[]>(
  'card/fetchStatus',
  async (_, thunkAPI) => {
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getCards()`;
     * Right now we just return an empty array.
     */
    return Promise.resolve([]);
  }
);

export const initialCardState: CardState = cardAdapter.getInitialState({
  loadingStatus: 'not loaded',
  error: undefined,
});

export const cardSlice = createSlice({
  name: CARD_FEATURE_KEY,
  initialState: initialCardState,
  reducers: {
    add: cardAdapter.addOne,
    remove: cardAdapter.removeOne,
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCard.pending, (state: CardState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchCard.fulfilled,
        (state: CardState, action: PayloadAction<CardEntity[]>) => {
          cardAdapter.setAll(state, action.payload);
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(fetchCard.rejected, (state: CardState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      });
  },
});

/*
 * Export reducer for store configuration.
 */
export const cardReducer = cardSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(cardActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const cardActions = cardSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllCard);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = cardAdapter.getSelectors();

export const getCardState = (rootState: {
  [CARD_FEATURE_KEY]: CardState;
}): CardState => rootState[CARD_FEATURE_KEY];

export const selectAllCard = createSelector(getCardState, selectAll);

export const selectCardEntities = createSelector(getCardState, selectEntities);
