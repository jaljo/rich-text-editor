import { map, takeUntil, switchMap, filter } from "rxjs/operators"
import { combineEpics, ofType } from "redux-observable"
import { logObservableError, isEscapeKey } from "../../Util"
import { OPEN, CLOSE, close, CLEAR } from "../../Redux/State/MediaPicker/MediaPicker"
import { PICK_IMAGE_WITH_CREDITS } from "../../Redux/State/MediaPicker/ImagePicker"
import { PICK_VIDEO } from "../../Redux/State/MediaPicker/VideoPicker"
import {
  OPEN_INSERT_YOUTUBE_VIDEO,
  OPEN_INSERT_TWEET,
} from "../../Redux/State/TextEditor/ParagraphToolbox"
import { race, fromEvent } from "rxjs"

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
)
export default combineEpics(
  closeMediaPickerEpic,
)
