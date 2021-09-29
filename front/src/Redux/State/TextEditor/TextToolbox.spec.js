import {
  clear,
  closeLinkCreator,
  hideAll,
  INITIAL_STATE,
  initialize,
  INSTANCE_INITIAL_STATE,
  openLinkCreator,
  default as reducer,
  refreshButtonsState,
  saveRange,
  show,
} from './TextToolbox'

const instanceExists = {
  'editor-name': INSTANCE_INITIAL_STATE,
}

describe('Redux :: State :: TextEditor :: TextToolbox', () => {
  it('reduces to initial state by default', () => {
    expect(reducer()).toEqual(INITIAL_STATE);
  });

  it('reduces initialize (create anamed instance)', () => {
    expect(
      reducer(INITIAL_STATE, initialize('editor-name'))
    ).toEqual(instanceExists);
  });

  it('reduces clear (remove anamed instance)', () => {
    expect(
      reducer(instanceExists, clear('editor-name'))
    ).toEqual(INITIAL_STATE);
  });

  /**
   * this should never be possible to have multiple visibles instances, we only
   * use this for test purpose.
   */
  const multipleInstances = {
    'instance-a': { ...INSTANCE_INITIAL_STATE, visible: true },
    'instance-b': { ...INSTANCE_INITIAL_STATE, visible: true },
    'instance-c': { ...INSTANCE_INITIAL_STATE, visible: false },
    'instance-d': { ...INSTANCE_INITIAL_STATE, visible: true },
  }

  it('reduces show', () => {
    expect(
      reducer(multipleInstances, show('instance-c', 350))
    ).toEqual({
      'instance-a': { ...INSTANCE_INITIAL_STATE, visible: false },
      'instance-b': { ...INSTANCE_INITIAL_STATE, visible: false },
      'instance-c': {
        ...INSTANCE_INITIAL_STATE,
        isLinkCreatorOpened: false,
        top: 350,
        visible: true,
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

  it('reduces open link creator', () => {
    expect(
      reducer(instanceExists, openLinkCreator('editor-name'))
    ).toEqual({
      'editor-name': {
        ...INSTANCE_INITIAL_STATE,
        isLinkCreatorOpened: true,
      },
    });
  });

  it('reduces close link creator', () => {
    expect(
      reducer(instanceExists, closeLinkCreator('editor-name'))
    ).toEqual({
      'editor-name': {
        ...INSTANCE_INITIAL_STATE,
        isLinkCreatorOpened: false,
      },
    });
  });

  it('reduces saveRange', () => {
    expect(
      reducer(instanceExists, saveRange('editor-name', { anchorNode: 'text' }))
    ).toEqual({
      'editor-name': {
        ...INSTANCE_INITIAL_STATE,
        range: { anchorNode: 'text' },
      },
    });
  });

  it('reduces refresh buttons state', () => {
    expect(
      reducer(instanceExists, refreshButtonsState('editor-name', {
        isBold: false,
        isItalic: true,
        isLink: false,
        isQuote: false,
        isTitle: false,
        isUnderline: true,
      }))
    ).toEqual({
      'editor-name': {
        ...INSTANCE_INITIAL_STATE,
        isBold: false,
        isItalic: true,
        isLink: false,
        isQuote: false,
        isTitle: false,
        isUnderline: true,
      },
    });
  });
});
