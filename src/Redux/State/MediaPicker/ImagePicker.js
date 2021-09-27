import { always, dec, inc, lt, when } from 'ramda'
import { createReducer } from '../../../Util'

// image picker initial state
export const INITIAL_STATE = {
  isFetching: false,
  images: [],
  page: 1,
  searchString: '',
  error: null,
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
export const fetchImages = (searchString = 'nature') => ({
  type: FETCH_IMAGES,
  searchString,
})

// receivedImages :: [Image] -> Action
export const receivedImages = images => ({
  type: RECEIVED_IMAGES,
  images: images || [],
})

// scrollLeft :: () -> Action
export const scrollLeft = always({ type: SCROLL_LEFT })

// scrollRight :: () -> Action
export const scrollRight = always({ type: SCROLL_RIGHT })

// pickImage :: (Number, String, Object) -> Action
export const pickImage = (imageId, domain, extra) => ({
  type: PICK_IMAGE,
  imageId,
  domain,
  extra, // any extra values related to the given domain
})

// pickImageWithCredits :: (Number, String, Object) -> Action
export const pickImageWithCredits = (imageId, domain, extra) => ({
  type: PICK_IMAGE_WITH_CREDITS,
  imageId,
  domain,
  extra,
})

// error :: String -> Action.ERROR
export const error = message => ({
  type: ERROR,
  message,
})

// clear :: () -> Action.CLEAR
export const clear = always({ type: CLEAR })

// ImagePicker :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [FETCH_IMAGES]: (state, { searchString }) => ({
    ...state,
    isFetching: true,
    page: 1,
    searchString,
    error: null,
  }),
  [RECEIVED_IMAGES]: (state, { images }) => ({
    ...state,
    isFetching: false,
    images,
    error: null,
  }),
  [SCROLL_LEFT]: state => ({
    ...state,
    isFetching: true,
    page: when(
      lt(1),
      dec,
    )(state.page),
    error: null,
  }),
  [SCROLL_RIGHT]: state => ({
    ...state,
    isFetching: true,
    page: inc(state.page),
    error: null,
  }),
  [PICK_IMAGE]: state => ({
    ...state,
    error: null,
  }),
  [PICK_IMAGE_WITH_CREDITS]: state => ({
    ...state,
    error: null,
  }),
  [ERROR]: (state, { message }) => ({
    ...state,
    error: message,
  }),
  [CLEAR]: always(INITIAL_STATE)
})
