import { createReducer } from '../../../Util'
import { omit } from 'ramda'

export const INITIAL_STATE = {}

// InsertYoutbe inital state
export const INSTANCE_INITIAL_STATE = {
  error: false,
}

// InsertYoutube action types
export const INSERT_YOUTUBE_VIDEO = '@knp/TextEditor/InsertYoutube/INSERT_YOUTUBE_VIDEO'
export const YOUTUBE_VIDEO_INSERTED = '@knp/TextEditor/InsertYoutube/YOUTUBE_VIDEO_INSERTED'
export const INITIALIZE = '@knp/TextEditor/InsertYoutube/INITIALIZE'
export const CLEAR = '@knp/TextEditor/InsertYoutube/CLEAR'
export const ERROR = '@knp/TextEditor/InsertYoutbe/ERROR'

// insertYoutubeVideo :: (String, String)  -> Action.INSERT_YOUTUBE_VIDEO
export const insertYoutubeVideo = (editorName, url) => ({
  type: INSERT_YOUTUBE_VIDEO,
  editorName,
  url,
})

// youtubeVideoInserted :: String -> Action.YOUTUBE_VIDEO_INSERTED
export const youtubeVideoInserted = editorName => ({
  type: YOUTUBE_VIDEO_INSERTED,
  editorName,
})

// initialize :: String -> Action.INITIALIZE
export const initialize = editorName => ({
  type: INITIALIZE,
  editorName,
})

// error :: String -> Action.ERROR
export const error = editorName => ({
  type: ERROR,
  editorName,
})

// clear :: String -> Action.CLEAR
export const clear = editorName => ({
  type: CLEAR,
  editorName,
})
// InsertYoutube :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [INITIALIZE]: (state, { editorName }) => ({
    ...state,
    [editorName]: { ...INSTANCE_INITIAL_STATE },
  }),

  [INSERT_YOUTUBE_VIDEO]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      error: false,
    },
  }),

  [YOUTUBE_VIDEO_INSERTED]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      error: false,
    },
  }),

  [ERROR]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      error: true,
    },
  }),

  [CLEAR]: (state, { editorName }) => omit([editorName], state),
})
