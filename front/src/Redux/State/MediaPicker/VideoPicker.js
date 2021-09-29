import {
  always,
  dec,
  inc,
  lt,
  when,
} from 'ramda'
import {
  createReducer,
} from '../../../Util'

// VideoPicker initial state
export const INITIAL_STATE = {
  isFetching: false,
  limit: 10,
  page: 1,
  searchString: '',
  videos: [],
}

// VideoPicker action types
export const FETCH_VIDEOS = '@knp/MediaPicker/VideoPicker/FETCH_VIDEOS'
export const SEARCH_VIDEOS = '@knp/MediaPicker/VideoPicker/SEARCH_VIDEOS'
export const VIDEOS_RECEIVED = '@knp/MediaPicker/VideoPicker/VIDEOS_RECEIVED'
export const SCROLL_LEFT = '@knp/MediaPicker/VideoPicker/SCROLL_LEFT'
export const SCROLL_RIGHT = '@knp/MediaPicker/VideoPicker/SCROLL_RIGHT'
export const PICK_VIDEO = '@knp/MediaPicker/VideoPicker/PICK_VIDEO'
export const CLEAR = '@knp/MediaPicker/VideoPicker/CLEAR'

// fetchVideos :: () -> Action.FETCH_VIDEOS
export const fetchVideos = always({ type: FETCH_VIDEOS })

// searchVideos :: String -> Action.SEARCH_VIDEOS
export const searchVideos = (searchString = '') => ({
  searchString,
  type: SEARCH_VIDEOS,
})

// videosReceived :: [Video] -> Action.VIDEOS_RECEIVED
export const videosReceived = videos => ({
  type: VIDEOS_RECEIVED,
  videos: videos || [],
})

// scrollLeft :: () -> Action
export const scrollLeft = always({ type: SCROLL_LEFT })

// scrollRight :: () -> Action
export const scrollRight = always({ type: SCROLL_RIGHT })

// pickVideo :: (Number, String, Object) -> Action.PICK_VIDEO
export const pickVideo = (videoId, domain, extra) => ({
  domain,
  // any extra values related to the given domain
  extra,
  type: PICK_VIDEO,
  videoId,
})

// clear :: () -> Action.CLEAR
export const clear = always({ type: CLEAR })

// VideoPicker :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [CLEAR]: always(INITIAL_STATE),

  [FETCH_VIDEOS]: state => ({
    ...state,
    isFetching: true,
  }),

  [SCROLL_LEFT]: state => ({
    ...state,
    page: when(lt(1), dec)(state.page),
  }),

  [SCROLL_RIGHT]: state => ({
    ...state,
    page: inc(state.page),
  }),

  [SEARCH_VIDEOS]: (state, { searchString }) => ({
    ...state,
    page: 1,
    searchString,
  }),

  [VIDEOS_RECEIVED]: (state, { videos }) => ({
    ...state,
    isFetching: false,
    videos,
  }),
})
