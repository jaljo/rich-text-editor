import { omit, always, compose } from "ramda"
import { createReducer, hideObjects } from "../../../Util"

// paragraph toolbox initial state
export const INSTANCE_INITIAL_STATE = {
  insertTweetOpened: false,
  visible: false,
  top: 0,
  targetNodeIndex: null,
  insertYoutubeVideoOpened: false,
}

export const INITIAL_STATE = {}

// paragraph toolbox action types
export const INITIALIZE = "@knp/TextEditor/ParagraphToolbox/INITIALIZE"
export const SHOW = "@knp/TextEditor/ParagraphToolbox/SHOW"
export const HIDE_ALL = "@knp/TextEditor/ParagraphToolbox/HIDE_ALL"
export const INSERT_IMAGE = "@knp/TextEditor/ParagraphToolbox/INSERT_IMAGE"
export const IMAGE_INSERTED = "@knp/TextEditor/ParagraphToolbox/IMAGE_INSERTED"
export const OPEN_INSERT_TWEET = "@knp/TextEditor/ParagraphToolbox/OPEN_INSERT_TWEET"
export const CLOSE_INSERT_TWEET = "@knp/TextEditor/ParagraphToolbox/CLOSE_INSERT_TWEET"
export const CLEAR = "@knp/TextEditor/ParagraphToolbox/CLEAR"
export const OPEN_INSERT_YOUTUBE_VIDEO = "@knp/TextEditor/ParagraphToolbox/OPEN_INSERT_YOUTUBE_VIDEO"
export const CLOSE_INSERT_YOUTUBE_VIDEO = "@knp/TextEditor/ParagraphToolbox/CLOSE_INSERT_YOUTUBE_VIDEO"
export const INSERT_VIDEO = "@knp/TextEditor/ParagraphToolbox/INSERT_VIDEO"
export const VIDEO_INSERTED = "@knp/TextEditor/ParagraphToolbox/VIDEO_INSERTED"

// initialize :: String -> Action
export const initialize = editorName => ({
  type: INITIALIZE,
  editorName,
})

// openInsertTweet :: String -> Action
export const openInsertTweet = editorName => ({
  type: OPEN_INSERT_TWEET,
  editorName,
})

// closeInsertTweet :: String -> Action
export const closeInsertTweet = editorName => ({
  type: CLOSE_INSERT_TWEET,
  editorName,
})

// show :: (String, Number, Number) -> Action.SHOW
export const show = (editorName, top, targetNodeIndex) => ({
  type: SHOW,
  editorName,
  top,
  targetNodeIndex,
})

// hideAll :: () -> Action.HIDE_ALL
export const hideAll = always({ type: HIDE_ALL })

// insertImage :: (String, Image) -> Action.INSERT_IMAGE
export const insertImage = (editorName, image) => ({
  type: INSERT_IMAGE,
  editorName,
  image,
})

// imageInserted :: String -> Action.IMAGE_INSERTED
export const imageInserted = editorName => ({
  type: IMAGE_INSERTED,
  editorName,
})

// clear :: String -> Action
export const clear = editorName => ({
  type: CLEAR,
  editorName,
})

// openInsertYoutubeVideo :: () -> Action.OPEN_INSERT_YOUTUBE
export const openInsertYoutubeVideo = editorName => ({
  type: OPEN_INSERT_YOUTUBE_VIDEO,
  editorName,
})

// closeInsertYoutubeVideo :: () -> Action.CLOSE_INSERT_YOUTUBE
export const closeInsertYoutubeVideo = editorName => ({
  type: CLOSE_INSERT_YOUTUBE_VIDEO,
  editorName,
})

// insertVideo :: (String, Video) -> Action.INSERT_VIDEO
export const insertVideo = (editorName, video) => ({
  type: INSERT_VIDEO,
  editorName,
  video,
})

// videoInserted :: (String, String) -> Action.VIDEO_INSERTED
export const videoInserted = (editorName, id) => ({
  type: VIDEO_INSERTED,
  editorName,
  id,
})

// ParagraphToolbox :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [INITIALIZE]: (state, { editorName }) => ({
    ...state,
    [editorName]: {...INSTANCE_INITIAL_STATE},
  }),

  [SHOW]: (state, { editorName, top, targetNodeIndex }) => ({
    [editorName]: {
      ...state[editorName],
      visible: true,
      insertTweetOpened: false,
      insertYoutubeVideoOpened: false, 
      top,
      targetNodeIndex,
    },
    ...compose(hideObjects, omit([editorName]))(state),
  }),

  [HIDE_ALL]: state => hideObjects(state),

  [OPEN_INSERT_TWEET]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      insertTweetOpened: true,
    },
  }),

  [CLOSE_INSERT_TWEET]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      insertTweetOpened: false,
    },
  }),

  [CLEAR]: (state, { editorName }) => omit([editorName], state),

  [OPEN_INSERT_YOUTUBE_VIDEO]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      insertYoutubeVideoOpened: true,
    },
  }),

  [CLOSE_INSERT_YOUTUBE_VIDEO]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      insertYoutubeVideoOpened: false,
    },
  }),
})
