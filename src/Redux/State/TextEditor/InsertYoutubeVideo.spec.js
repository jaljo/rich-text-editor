import {
  clear,
  default as reducer,
  error,
  initialize,
  insertYoutubeVideo,
  youtubeVideoInserted,
  INITIAL_STATE,
  INSTANCE_INITIAL_STATE,
} from './InsertYoutubeVideo'

const instanceExists = {
  'editor-name': INSTANCE_INITIAL_STATE,
}

describe('Redux :: State :: TextEditor :: insertYoutubeVideo', () => {
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

  it('reduces insertYoutubeVideo', () => {
    expect(
      reducer(instanceExists, insertYoutubeVideo('editor-name', 'url'))
    ).toEqual({
      'editor-name': {
        ...INSTANCE_INITIAL_STATE,
        error: false,
      },
    });
  });

  it('reduces youtubeVideoInserted', () => {
    expect(
      reducer(instanceExists, youtubeVideoInserted('editor-name'))
    ).toEqual({
      'editor-name': {
        ...INSTANCE_INITIAL_STATE,
        error: false,
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
      },
    });
  });
});
