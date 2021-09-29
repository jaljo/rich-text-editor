import { T, always, cond, equals } from 'ramda'
import { createReducer } from '../../../Util'
import { combineReducers } from 'redux'
import ImagePicker from './ImagePicker'
import VideoPicker from './VideoPicker'

// media picker initial state
export const INITIAL_STATE = {
  opened: false,
  imagePickerOpened: false,
  videoPickerOpened: false,
  domain: null,
  extra: null,
}

// media picker action types
export const OPEN = '@knp/MediaPicker/OPEN'
export const CLOSE = '@knp/MediaPicker/CLOSE'
export const OPEN_IMAGE_PICKER = '@knp/MediaPicker/OPEN_IMAGE_PICKER'
export const OPEN_VIDEO_PICKER = '@knp/MediaPicker/OPEN_VIDEO_PICKER'
export const CLEAR = '@knp/MediaPicker/CLEAR'

// open :: (String, Object, String) -> Action
export const open = (domain, extra, defaultOpenedComponent) => ({
  type: OPEN,
  domain,
  // any extra values related to the given domain
  extra,
  // the component opend when opening the mediapicker.
  // valid values are "videoPicker" | "imageUploader"
  defaultOpenedComponent,
})

// close :: () -> Action
export const close = always({ type: CLOSE })

// openImagePicker :: () -> Action
export const openImagePicker = always({ type: OPEN_IMAGE_PICKER })

// openVideoPicker :: () -> Action.OPEN_VIDEO_PICKER
export const openVideoPicker = always({ type: OPEN_VIDEO_PICKER })

// clear :: () -> Action.CLEAR
export const clear = always({ type: CLEAR})

// Display :: (State, Action *) -> State
export const Display = createReducer(INITIAL_STATE, {
  [OPEN]: (state, { domain, extra, defaultOpenedComponent }) => ({
    ...state,
    opened: true,
    domain,
    extra,
    ...cond([
      [equals('videoPicker'), always({ videoPickerOpened: true })],
      [T, always({ imagePickerOpened: true })],
    ])(defaultOpenedComponent)
  }),
  [CLOSE]: always(INITIAL_STATE),
  [OPEN_IMAGE_PICKER]: state => ({
    ...state,
    imagePickerOpened: true,
    videoPickerOpened: false,
  }),
  [OPEN_VIDEO_PICKER]: state => ({
    ...state,
    imagePickerOpened: false,
    videoPickerOpened: true,
  }),
  [CLEAR]: always(INITIAL_STATE),
})

// MediaPicker :: (State, Action *) -> State
export default combineReducers({
  Display,
  ImagePicker,
  VideoPicker,
})
