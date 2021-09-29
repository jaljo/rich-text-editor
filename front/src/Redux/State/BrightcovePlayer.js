import {
  always,
  append,
} from 'ramda'
import {
  createReducer,
} from '../../Util'

// BrightcovePlayer initial state
export const INITIAL_STATE = {
  arPlayerReady: false,
  enPlayerReady: false,
  frPlayerReady: false,
  renderedVideos: [],
}

// BrightcovePlayer action types
export const LOAD_PLAYER = '@knp/BrightcovePlayer/LOAD_PLAYER'
export const PLAYER_LOADED = '@knp/BrightcovePlayer/PLAYER_LOADED'
export const RENDER_VIDEO = '@knp/BrightcovePlayer/RENDER_VIDEO'
export const REMOVE_VIDEO = '@knp/BrightcovePlayer/REMOVE_VIDEO'
export const VIDEO_RENDERED = '@knp/BrightcovePlayer/VIDEO_RENDERED'
export const VIDEO_REMOVED = '@knp/BrightcovePlayer/VIDEO_REMOVED'

// loadPlayer :: String -> Action.LOAD_PLAYER
export const loadPlayer = locale => ({
  locale,
  type: LOAD_PLAYER,
})

// playerLoaded :: String -> Action.PLAYER_LOADED
export const playerLoaded = locale => ({
  locale,
  type: PLAYER_LOADED,
})

// renderVideo :: String -> Action.RENDER_VIDEO
export const renderVideo = id => ({
  id,
  type: RENDER_VIDEO,
})

// removeVideo :: String -> Action.REMOVE_VIDEO
export const removeVideo = id => ({
  id,
  type: REMOVE_VIDEO,
})

// videoRendered :: (String, String) -> Action.VIDEO_RENDERED
export const videoRendered = (id, originalHtmlMarkup) => ({
  id,
  originalHtmlMarkup,
  type: VIDEO_RENDERED,
})

// videoRemoved :: () -> Action.VIDEO_REMOVED
export const videoRemoved = always({ type: VIDEO_REMOVED })

// BrightcovePlayer :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [PLAYER_LOADED]: (state, { locale }) => ({
    ...state,
    [`${locale}PlayerReady`]: true,
  }),

  [VIDEO_RENDERED]: (state, { id, originalHtmlMarkup }) => ({
    ...state,
    renderedVideos: append({ id, originalHtmlMarkup }, state.renderedVideos),
  }),
})
