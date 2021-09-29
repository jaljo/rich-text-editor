import {
  always,
  cond,
  equals,
  T,
} from "ramda";
import {
  combineReducers,
} from "redux";
import {
  createReducer,
} from "../../../Util";
import ImagePicker from "./ImagePicker";
import VideoPicker from "./VideoPicker";

// media picker initial state
export const INITIAL_STATE = {
  domain: null,
  extra: null,
  imagePickerOpened: false,
  opened: false,
  videoPickerOpened: false,
};

// media picker action types
export const OPEN = "@knp/MediaPicker/OPEN";
export const CLOSE = "@knp/MediaPicker/CLOSE";
export const OPEN_IMAGE_PICKER = "@knp/MediaPicker/OPEN_IMAGE_PICKER";
export const OPEN_VIDEO_PICKER = "@knp/MediaPicker/OPEN_VIDEO_PICKER";
export const CLEAR = "@knp/MediaPicker/CLEAR";

// open :: (String, Object, String) -> Action
export const open = (domain, extra, defaultOpenedComponent) => ({
  // component opened when opening the mediapicker (i.e. "videoPicker", "imageUploader")
  defaultOpenedComponent,
  domain,
  // any extra values related to the given domain
  extra,
  type: OPEN,
});

// close :: () -> Action
export const close = always({ type: CLOSE });

// openImagePicker :: () -> Action
export const openImagePicker = always({ type: OPEN_IMAGE_PICKER });

// openVideoPicker :: () -> Action.OPEN_VIDEO_PICKER
export const openVideoPicker = always({ type: OPEN_VIDEO_PICKER });

// clear :: () -> Action.CLEAR
export const clear = always({ type: CLEAR });

// Display :: (State, Action *) -> State
export const Display = createReducer(INITIAL_STATE, {
  [CLEAR]: always(INITIAL_STATE),

  [CLOSE]: always(INITIAL_STATE),

  [OPEN]: (state, { domain, extra, defaultOpenedComponent }) => ({
    ...state,
    domain,
    extra,
    opened: true,
    ...cond([
      [equals("videoPicker"), always({ videoPickerOpened: true })],
      [T, always({ imagePickerOpened: true })],
    ])(defaultOpenedComponent),
  }),

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
});

// MediaPicker :: (State, Action *) -> State
export default combineReducers({
  Display,
  ImagePicker,
  VideoPicker,
});
