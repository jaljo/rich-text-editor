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

// image picker initial state
export const INITIAL_STATE = {
  error: null,
  images: [],
  isFetching: false,
  page: 1,
  searchString: '',
}

// image picker action types
export const FETCH_IMAGES = '@knp/MediaPicker/ImagePicker/FETCH_IMAGES'
export const RECEIVED_IMAGES = '@knp/MediaPicker/ImagePicker/RECEIVED_IMAGES'
export const SCROLL_LEFT = '@knp/MediaPicker/ImagePicker/SCROLL_LEFT'
export const SCROLL_RIGHT = '@knp/MediaPicker/ImagePicker/SCROLL_RIGHT'
export const PICK_IMAGE = '@knp/MediaPicker/ImagePicker/PICK_IMAGE'
export const PICK_IMAGE_WITH_CREDITS = '@knp/MediaPicker/ImagePicker/PICK_IMAGE_WITH_CREDITS'
export const ERROR = '@knp/MediaPicker/ImagePicker/ERROR'
export const CLEAR = '@knp/MediaPicker/ImagePicker/CLEAR'

// fetchImages :: String -> Action
export const fetchImages = (searchString = '') => ({
  searchString,
  type: FETCH_IMAGES,
})

// receivedImages :: [Image] -> Action
export const receivedImages = images => ({
  images: images || [],
  type: RECEIVED_IMAGES,
})

// scrollLeft :: () -> Action
export const scrollLeft = always({ type: SCROLL_LEFT })

// scrollRight :: () -> Action
export const scrollRight = always({ type: SCROLL_RIGHT })

// pickImage :: (Number, String, Object) -> Action
export const pickImage = (imageId, domain, extra) => ({
  domain,
  // any extra values related to the given domain
  extra,
  imageId,
  type: PICK_IMAGE,
})

// pickImageWithCredits :: (Number, String, Object) -> Action
export const pickImageWithCredits = (imageId, domain, extra) => ({
  domain,
  extra,
  imageId,
  type: PICK_IMAGE_WITH_CREDITS,
})

// error :: String -> Action.ERROR
export const error = message => ({
  message,
  type: ERROR,
})

// clear :: () -> Action.CLEAR
export const clear = always({ type: CLEAR })

// ImagePicker :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [CLEAR]: always(INITIAL_STATE),

  [ERROR]: (state, { message }) => ({
    ...state,
    error: message,
  }),

  [FETCH_IMAGES]: (state, { searchString }) => ({
    ...state,
    error: null,
    isFetching: true,
    page: 1,
    searchString,
  }),

  [PICK_IMAGE]: state => ({
    ...state,
    error: null,
  }),

  [PICK_IMAGE_WITH_CREDITS]: state => ({
    ...state,
    error: null,
  }),

  [RECEIVED_IMAGES]: (state, { images }) => ({
    ...state,
    error: null,
    images,
    isFetching: false,
  }),

  [SCROLL_LEFT]: state => ({
    ...state,
    error: null,
    isFetching: true,
    page: when(
      lt(1),
      dec,
    )(state.page),
  }),

  [SCROLL_RIGHT]: state => ({
    ...state,
    error: null,
    isFetching: true,
    page: inc(state.page),
  }),
})
