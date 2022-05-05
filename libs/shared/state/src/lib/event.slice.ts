import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

export const EVENT_FEATURE_KEY = 'event';

/*
 * Update these interfaces according to your requirements.
 */
export interface EventEntity {
  id: number;
}

export interface EventState extends EntityState<EventEntity> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string;
}

export const eventAdapter = createEntityAdapter<EventEntity>({});

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
 *   dispatch(fetchEvent())
 * }, [dispatch]);
 * ```
 */
export const fetchEvent = createAsyncThunk<EventEntity[]>(
  'event/fetchStatus',
  async (_, thunkAPI) => {
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getEvents()`;
     * Right now we just return an empty array.
     */
    return Promise.resolve([]);
  }
);

export const initialEventState: EventState = eventAdapter.getInitialState({
  loadingStatus: 'not loaded',
  error: undefined,
});

export const eventSlice = createSlice({
  name: EVENT_FEATURE_KEY,
  initialState: initialEventState,
  reducers: {
    add: eventAdapter.addOne,
    remove: eventAdapter.removeOne,
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvent.pending, (state: EventState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchEvent.fulfilled,
        (state: EventState, action: PayloadAction<EventEntity[]>) => {
          eventAdapter.setAll(state, action.payload);
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(fetchEvent.rejected, (state: EventState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      });
  },
});

/*
 * Export reducer for store configuration.
 */
export const eventReducer = eventSlice.reducer;

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
 *   dispatch(eventActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const eventActions = eventSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllEvent);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = eventAdapter.getSelectors();

export const getEventState = (rootState: {
  [EVENT_FEATURE_KEY]: EventState;
}): EventState => rootState[EVENT_FEATURE_KEY];

export const selectAllEvent = createSelector(getEventState, selectAll);

export const selectEventEntities = createSelector(
  getEventState,
  selectEntities
);
