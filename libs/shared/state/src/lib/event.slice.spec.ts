import { fetchEvent, eventAdapter, eventReducer } from './event.slice';

describe('event reducer', () => {
  it('should handle initial state', () => {
    const expected = eventAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(eventReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle fetchEvents', () => {
    let state = eventReducer(undefined, fetchEvent.pending(''));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
      })
    );

    state = eventReducer(state, fetchEvent.fulfilled([{ id: 1 }], ''));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
      })
    );

    state = eventReducer(state, fetchEvent.rejected(new Error('Uh oh'), ''));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'error',
        error: 'Uh oh',
        entities: { 1: { id: 1 } },
      })
    );
  });
});
