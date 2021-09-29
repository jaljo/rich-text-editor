import {
  clear,
  closeInsertTweet,
  default as reducer,
  hideAll,
  initialize,
  openInsertTweet,
  show,
  INITIAL_STATE,
  INSTANCE_INITIAL_STATE,
} from './ParagraphToolbox'

const instanceExists = {
  'editor-name': INSTANCE_INITIAL_STATE,
}

describe('Redux :: State :: TextEditor :: ParagraphToolbox', () => {
  it('reduces to initial state by default', () => {
    expect(reducer()).toEqual(INITIAL_STATE);
  });

  it('reduces initialize (creates a named instance)', () => {
    expect(
      reducer(INITIAL_STATE, initialize('editor-name'))
    ).toEqual(instanceExists);
  });

  it('reduces clear (remove a named instance)', () => {
    expect(
      reducer(instanceExists, clear('editor-name'))
    ).toEqual(INITIAL_STATE);
  });

  // this should never be possible to have multiple visibles instances,
  // we only use this for test purpose.
  const multipleInstances = {
    'instance-a': { ...INSTANCE_INITIAL_STATE, visible: true },
    'instance-b': { ...INSTANCE_INITIAL_STATE, visible: true },
    'instance-c': { ...INSTANCE_INITIAL_STATE, visible: false },
    'instance-d': { ...INSTANCE_INITIAL_STATE, visible: true },
  }

  it('reduces show', () => {
    expect(
      reducer(multipleInstances, show('instance-c', 20, 2))
    ).toEqual({
      'instance-a': { ...INSTANCE_INITIAL_STATE, visible: false },
      'instance-b': { ...INSTANCE_INITIAL_STATE, visible: false },
      'instance-c': {
        ...INSTANCE_INITIAL_STATE,
        visible: true,
        top: 20,
        targetNodeIndex: 2,
        insertTweetOpened: false,
        insertYoutubeVideoOpened: false,
      },
      'instance-d': { ...INSTANCE_INITIAL_STATE, visible: false },
    });
  });

  it('reduces hideAll', () => {
    expect(
      reducer(multipleInstances, hideAll())
    ).toEqual({
      'instance-a': { ...INSTANCE_INITIAL_STATE, visible: false },
      'instance-b': { ...INSTANCE_INITIAL_STATE, visible: false },
      'instance-c': { ...INSTANCE_INITIAL_STATE, visible: false },
      'instance-d': { ...INSTANCE_INITIAL_STATE, visible: false },
    });
  });

  it('reduces openInsertTweet', () => {
    expect(
      reducer(instanceExists, openInsertTweet('editor-name'))
    ).toEqual({
      'editor-name': {
        ...INSTANCE_INITIAL_STATE,
        insertTweetOpened: true,
      },
    });
  });

  it('reduces closeInsertTweet', () => {
    expect(
      reducer(instanceExists, closeInsertTweet('editor-name'))
    ).toEqual({
      'editor-name': {
        ...INSTANCE_INITIAL_STATE,
        insertTweetOpened: false,
      },
    });
  });
});
