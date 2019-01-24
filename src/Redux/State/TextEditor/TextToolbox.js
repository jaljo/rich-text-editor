import { always, omit, compose } from 'ramda'
import { createReducer, hideObjects } from '../../../Util'

// text toolbox initial state
export const INSTANCE_INITIAL_STATE = {
  visible: false,
  top: 0,
  isLinkCreatorOpened: false,
  range: null,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isTitle: false,
  isQuote: false,
  isLink: false,
}

export const INITIAL_STATE = {}

// text toolbox action types
export const INITIALIZE = '@i24/TextEditor/TextToolbox/INITIALIZE'
export const CLEAR = '@i24/TextEditor/TextToolbox/CLEAR'
export const SHOW = '@i24/TextEditor/TextToolbox/SHOW'
export const HIDE_ALL = '@i24/TextEditor/TextToolbox/HIDE_ALL'
export const OPEN_LINK_CREATOR = '@i24/TextEditor/TextToolbox/OPEN_LINK_CREATOR'
export const CLOSE_LINK_CREATOR = '@i24/TextEditor/TextToolbox/CLOSE_LINK_CREATOR'
export const MUTATE = '@i24/TextEditor/TextToolbox/MUTATE'
export const SAVE_RANGE = '@i24/TextEditor/TextToolbox/SAVE_RANGE'
export const REFRESH_BUTTONS_STATE = '@i24/TextEditor/TextToolbox/REFRESH_BUTTONS_STATE'

// initialize :: String -> Action.INITIALIZE
export const initialize = editorName => ({
  type: INITIALIZE,
  editorName,
})

// clear :: String -> Action.CLEAR
export const clear = editorName => ({
  type: CLEAR,
  editorName,
})

// show :: String -> Number -> Action.SHOW
export const show = (editorName, top) => ({
  type: SHOW,
  editorName,
  top,
})

// hideAll :: () -> Action.HIDE_ALL
export const hideAll = always({ type: HIDE_ALL })

// mutate :: String -> (String, Object) -> Action.MUTATE
export const mutate = editorName => (mutation, options = null) => ({
  type: MUTATE,
  editorName,
  mutation,
  options,
})

// openLinkCreator :: String -> Action.OPEN_LINK_CREATOR
export const openLinkCreator = editorName => ({
  type: OPEN_LINK_CREATOR,
  editorName,
})

// closeLinkCreator :: String -> Action.CLOSE_LINK_CREATOR
export const closeLinkCreator = editorName => ({
  type: CLOSE_LINK_CREATOR,
  editorName,
})

// saveRange :: (String, Range) -> Action.SAVE_SELECTION
// @SEE https://developer.mozilla.org/en-US/docs/Web/API/Range
export const saveRange = (editorName, range) => ({
  type: SAVE_RANGE,
  editorName,
  range,
})

// refreshButtonsState :: (String, Object) -> Action.REFRESH_BUTTONS_STATE
export const refreshButtonsState = (editorName, {
  isBold,
  isItalic,
  isUnderline,
  isTitle,
  isQuote,
  isLink,
}) => ({
  type: REFRESH_BUTTONS_STATE,
  editorName,
  isBold,
  isItalic,
  isUnderline,
  isTitle,
  isQuote,
  isLink,
})

// TextToolbox :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [INITIALIZE]: (state, { editorName }) => ({
    ...state,
    [editorName]: {...INSTANCE_INITIAL_STATE},
  }),

  [CLEAR]: (state, { editorName }) => omit([editorName], state),

  [SHOW]: (state, { editorName, top }) => ({
    [editorName]: {
      ...state[editorName],
      visible: true,
      isLinkCreatorOpened: false,
      top,
    },
    ...compose(hideObjects, omit([editorName]))(state),
  }),

  [HIDE_ALL]: state => hideObjects(state),

  [OPEN_LINK_CREATOR]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      isLinkCreatorOpened: true,
    }
  }),

  [CLOSE_LINK_CREATOR]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      isLinkCreatorOpened: false,
    }
  }),

  [SAVE_RANGE]: (state, { editorName, range }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      range,
    },
  }),

  [REFRESH_BUTTONS_STATE]: (state, {
    editorName,
    isBold,
    isItalic,
    isUnderline,
    isTitle,
    isQuote,
    isLink,
  }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      isBold,
      isItalic,
      isUnderline,
      isTitle,
      isQuote,
      isLink,
    }
  }),
})
