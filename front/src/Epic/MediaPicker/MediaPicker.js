import {
  CLEAR,
  close,
  CLOSE,
  OPEN,
} from "../../Redux/State/MediaPicker/MediaPicker";
import {
  combineEpics,
  ofType,
} from "redux-observable";
import {
  filter,
  map,
  switchMap,
  takeUntil,
} from "rxjs/operators";
import {
  fromEvent,
  race,
} from "rxjs";
import {
  isEscapeKey,
  logObservableError,
} from "../../Util";
import {
  OPEN_INSERT_TWEET,
  OPEN_INSERT_YOUTUBE_VIDEO,
} from "../../Redux/State/TextEditor/ParagraphToolbox";
import {
  PICK_IMAGE_WITH_CREDITS,
} from "../../Redux/State/MediaPicker/ImagePicker";
import {
  PICK_VIDEO,
} from "../../Redux/State/MediaPicker/VideoPicker";

// closeMediaPickerEpic :: Observable Action Error -> Observable Action.CLOSE
export const closeMediaPickerEpic = action$ => action$.pipe(
  ofType(OPEN),
  switchMap(() => race(
    action$.pipe(ofType(
      PICK_IMAGE_WITH_CREDITS,
      PICK_VIDEO,
      OPEN_INSERT_YOUTUBE_VIDEO,
      OPEN_INSERT_TWEET,
    )),
    fromEvent(window, "keydown").pipe(
      filter(isEscapeKey),
    ),
  ).pipe(
    takeUntil(action$.pipe(ofType(CLOSE, CLEAR))),
    map(close),
  )),
  logObservableError(),
);
export default combineEpics(
  closeMediaPickerEpic,
);
