import {
  always,
  compose,
  omit,
} from 'ramda'
import {
  createReducer,
  hideObjects,
} from '../../../Util'

// paragraph toolbox initial state
export const INSTANCE_INITIAL_STATE = {
  insertTweetOpened: false,
  insertYoutubeVideoOpened: false,
  targetNodeIndex: null,
  top: 0,
  visible: false,
}

export const INITIAL_STATE = {}

// paragraph toolbox action types
export const INITIALIZE = '@knp/TextEditor/ParagraphToolbox/INITIALIZE'
export const SHOW = '@knp/TextEditor/ParagraphToolbox/SHOW'
export const HIDE_ALL = '@knp/TextEditor/ParagraphToolbox/HIDE_ALL'
export const INSERT_IMAGE = '@knp/TextEditor/ParagraphToolbox/INSERT_IMAGE'
export const IMAGE_INSERTED = '@knp/TextEditor/ParagraphToolbox/IMAGE_INSERTED'
export const OPEN_INSERT_TWEET = '@knp/TextEditor/ParagraphToolbox/OPEN_INSERT_TWEET'
export const CLOSE_INSERT_TWEET = '@knp/TextEditor/ParagraphToolbox/CLOSE_INSERT_TWEET'
export const CLEAR = '@knp/TextEditor/ParagraphToolbox/CLEAR'
export const OPEN_INSERT_YOUTUBE_VIDEO = '@knp/TextEditor/ParagraphToolbox/OPEN_INSERT_YOUTUBE_VIDEO'
export const CLOSE_INSERT_YOUTUBE_VIDEO = '@knp/TextEditor/ParagraphToolbox/CLOSE_INSERT_YOUTUBE_VIDEO'
export const INSERT_VIDEO = '@knp/TextEditor/ParagraphToolbox/INSERT_VIDEO'
export const VIDEO_INSERTED = '@knp/TextEditor/ParagraphToolbox/VIDEO_INSERTED'

// initialize :: String -> Action
export const initialize = editorName => ({
  editorName,
  type: INITIALIZE,
})

// openInsertTweet :: String -> Action
export const openInsertTweet = editorName => ({
  editorName,
  type: OPEN_INSERT_TWEET,
})

// closeInsertTweet :: String -> Action
export const closeInsertTweet = editorName => ({
  editorName,
  type: CLOSE_INSERT_TWEET,
})

// show :: (String, Number, Number) -> Action.SHOW
export const show = (editorName, top, targetNodeIndex) => ({
  editorName,
  targetNodeIndex,
  top,
  type: SHOW,
})

// hideAll :: () -> Action.HIDE_ALL
export const hideAll = always({ type: HIDE_ALL })

// insertImage :: (String, Image) -> Action.INSERT_IMAGE
export const insertImage = (editorName, image) => ({
  editorName,
  image,
  type: INSERT_IMAGE,
})

// imageInserted :: String -> Action.IMAGE_INSERTED
export const imageInserted = editorName => ({
  editorName,
  type: IMAGE_INSERTED,
})

// clear :: String -> Action
export const clear = editorName => ({
  editorName,
  type: CLEAR,
})

// openInsertYoutubeVideo :: () -> Action.OPEN_INSERT_YOUTUBE
export const openInsertYoutubeVideo = editorName => ({
  editorName,
  type: OPEN_INSERT_YOUTUBE_VIDEO,
})

// closeInsertYoutubeVideo :: () -> Action.CLOSE_INSERT_YOUTUBE
export const closeInsertYoutubeVideo = editorName => ({
  editorName,
  type: CLOSE_INSERT_YOUTUBE_VIDEO,
})

// insertVideo :: (String, Video) -> Action.INSERT_VIDEO
export const insertVideo = (editorName, video) => ({
  editorName,
  type: INSERT_VIDEO,
  video,
})

// videoInserted :: (String, String) -> Action.VIDEO_INSERTED
export const videoInserted = (editorName, id) => ({
  editorName,
  id,
  type: VIDEO_INSERTED,
})

// ParagraphToolbox :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [CLEAR]: (state, { editorName }) => omit([editorName], state),

  [CLOSE_INSERT_TWEET]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      insertTweetOpened: false,
    },
  }),

  [CLOSE_INSERT_YOUTUBE_VIDEO]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      insertYoutubeVideoOpened: false,
    },
  }),

  [HIDE_ALL]: state => hideObjects(state),

  [INITIALIZE]: (state, { editorName }) => ({
    ...state,
    [editorName]: { ...INSTANCE_INITIAL_STATE },
  }),

  [OPEN_INSERT_TWEET]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      insertTweetOpened: true,
    },
  }),

  [OPEN_INSERT_YOUTUBE_VIDEO]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      insertYoutubeVideoOpened: true,
    },
  }),

  [SHOW]: (state, { editorName, top, targetNodeIndex }) => ({
    [editorName]: {
      ...state[editorName],
      insertTweetOpened: false,
      insertYoutubeVideoOpened: false,
      targetNodeIndex,
      top,
      visible: true,
    },
    ...compose(hideObjects, omit([editorName]))(state),
  }),
})
