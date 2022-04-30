import { fetchCard, cardAdapter, cardReducer } from './card.slice';

describe('card reducer', () => {
  it('should handle initial state', () => {
    const expected = cardAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(cardReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle fetchCards', () => {
    let state = cardReducer(undefined, fetchCard.pending(null, null));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
      })
    );

    state = cardReducer(state, fetchCard.fulfilled([{ id: 1 }], null, null));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
      })
    );

    state = cardReducer(
      state,
      fetchCard.rejected(new Error('Uh oh'), null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'error',
        error: 'Uh oh',
        entities: { 1: { id: 1 } },
      })
    );
  });
});
