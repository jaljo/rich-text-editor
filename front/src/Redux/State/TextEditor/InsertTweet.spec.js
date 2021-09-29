import {
  clear,
  default as reducer,
  error,
  initialize,
  insertTweet,
  embedTweetFetched,
  INITIAL_STATE,
  INSTANCE_INITIAL_STATE,
} from './InsertTweet'

const instanceExists = {
  'editor-name': INSTANCE_INITIAL_STATE,
}

describe('Redux :: State :: TextEditor :: InsertTweet', () => {
  it('reduces to initial state by default', () => {
    expect(reducer()).toEqual(INITIAL_STATE);
  });

  it('reduces initialize (create a named instance)', () => {
    expect(
      reducer(INITIAL_STATE, initialize('editor-name'))
    ).toEqual(instanceExists);
  });

  it('reduces clear (remove a named instance)', () => {
    expect(
      reducer(instanceExists, clear('editor-name'))
    ).toEqual(INITIAL_STATE);
  });

  it('reduces insertTweet', () => {
    expect(
      reducer(instanceExists, insertTweet('editor-name', 'url'))
    ).toEqual({
      'editor-name': {
        ...INSTANCE_INITIAL_STATE,
        error: false,
        fetching: true,
      },
    });
  });

  it('reduces tweetInserted', () => {
    expect(
      reducer(instanceExists, embedTweetFetched('editor-name'))
    ).toEqual({
      'editor-name': {
        ...INSTANCE_INITIAL_STATE,
        fetching: false,
      },
    });
  });

  it('reduces error', () => {
    expect(
      reducer(instanceExists, error('editor-name'))
    ).toEqual({
      'editor-name': {
        ...INSTANCE_INITIAL_STATE,
        error: true,
        fetching: false,
      },
    });
  });
});
