import { always, omit, compose } from 'ramda'
import { createReducer, hideObjects } from '../../../Util'

// text toolbox initial state
export const INSTANCE_INITIAL_STATE = {
  isBold: false,
  isItalic: false,
  isLink: false,
  isLinkCreatorOpened: false,
  isQuote: false,
  isTitle: false,
  isUnderline: false,
  range: null,
  top: 0,
  visible: false,
}

export const INITIAL_STATE = {}

// text toolbox action types
export const INITIALIZE = '@knp/TextEditor/TextToolbox/INITIALIZE'
export const CLEAR = '@knp/TextEditor/TextToolbox/CLEAR'
export const SHOW = '@knp/TextEditor/TextToolbox/SHOW'
export const HIDE_ALL = '@knp/TextEditor/TextToolbox/HIDE_ALL'
export const OPEN_LINK_CREATOR = '@knp/TextEditor/TextToolbox/OPEN_LINK_CREATOR'
export const CLOSE_LINK_CREATOR = '@knp/TextEditor/TextToolbox/CLOSE_LINK_CREATOR'
export const MUTATE = '@knp/TextEditor/TextToolbox/MUTATE'
export const SAVE_RANGE = '@knp/TextEditor/TextToolbox/SAVE_RANGE'
export const REFRESH_BUTTONS_STATE = '@knp/TextEditor/TextToolbox/REFRESH_BUTTONS_STATE'

// initialize :: String -> Action.INITIALIZE
export const initialize = editorName => ({
  editorName,
  type: INITIALIZE,
})

// clear :: String -> Action.CLEAR
export const clear = editorName => ({
  editorName,
  type: CLEAR,
})

// show :: String -> Number -> Action.SHOW
export const show = (editorName, top) => ({
  editorName,
  top,
  type: SHOW,
})

// hideAll :: () -> Action.HIDE_ALL
export const hideAll = always({ type: HIDE_ALL })

// mutate :: String -> (String, Object) -> Action.MUTATE
export const mutate = editorName => (mutation, options = null) => ({
  editorName,
  mutation,
  options,
  type: MUTATE,
})

// openLinkCreator :: String -> Action.OPEN_LINK_CREATOR
export const openLinkCreator = editorName => ({
  editorName,
  type: OPEN_LINK_CREATOR,
})

// closeLinkCreator :: String -> Action.CLOSE_LINK_CREATOR
export const closeLinkCreator = editorName => ({
  editorName,
  type: CLOSE_LINK_CREATOR,
})

/**
 * saveRange :: (String, Range) -> Action.SAVE_SELECTION
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Range
 */
export const saveRange = (editorName, range) => ({
  editorName,
  range,
  type: SAVE_RANGE,
})

// refreshButtonsState :: (String, Object) -> Action.REFRESH_BUTTONS_STATE
export const refreshButtonsState = (editorName, {
  isBold,
  isItalic,
  isLink,
  isQuote,
  isTitle,
  isUnderline,
}) => ({
  editorName,
  isBold,
  isItalic,
  isLink,
  isQuote,
  isTitle,
  isUnderline,
  type: REFRESH_BUTTONS_STATE,
})

// TextToolbox :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [CLEAR]: (state, { editorName }) => omit([editorName], state),

  [CLOSE_LINK_CREATOR]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      isLinkCreatorOpened: false,
    },
  }),

  [HIDE_ALL]: state => hideObjects(state),

  [INITIALIZE]: (state, { editorName }) => ({
    ...state,
    [editorName]: { ...INSTANCE_INITIAL_STATE },
  }),

  [OPEN_LINK_CREATOR]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      isLinkCreatorOpened: true,
    },
  }),

  [REFRESH_BUTTONS_STATE]: (state, {
    editorName,
    isBold,
    isItalic,
    isLink,
    isQuote,
    isTitle,
    isUnderline,
  }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      isBold,
      isItalic,
      isLink,
      isQuote,
      isTitle,
      isUnderline,
    },
  }),

  [SAVE_RANGE]: (state, { editorName, range }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      range,
    },
  }),

  [SHOW]: (state, { editorName, top }) => ({
    [editorName]: {
      ...state[editorName],
      isLinkCreatorOpened: false,
      top,
      visible: true,
    },
    ...compose(hideObjects, omit([editorName]))(state),
  }),
})
