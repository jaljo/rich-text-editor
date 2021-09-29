import { ofType, combineEpics } from "redux-observable"
import { map, mergeMap, tap, ignoreElements } from "rxjs/operators"
import { isEmptyParagraph } from "./ToolBoxes"
import {
  logObservableError,
  logObservableErrorAndTriggerAction,
} from "../../Util"
import {
  textPasted,
  pasteGranted,
  displayClipboardWarning,
  displayClipboardSupportError,
  PASTE_GRANTED,
  DISPLAY_CLIPBOARD_WARNING,
  DISPLAY_CLIPBOARD_SUPPORT_ERROR,
  PASTE,
  TEXT_PASTED,
} from "../../Redux/State/TextEditor/TextEditor"
import {
  allPass,
  compose,
  equals,
  ifElse,
  join,
  pipe,
  prop,
  tap as rtap,
  when,
} from "ramda"

// checkClipboardAccessEpic :: Epic -> Observable Action.PASTE_GRANTED Action.DISPLAY_CLIPBOARD_WARNING
const checkClipboardAccessEpic = action$ => action$.pipe(
  ofType(PASTE),
  mergeMap(() => navigator.permissions.query({"name": "clipboard-read"})),
  mergeMap(ifElse(
    isClipboardAccessGranted,
    () => navigator.clipboard.readText().then(pasteGranted),
    () => [displayClipboardWarning()],
  )),
  logObservableErrorAndTriggerAction(displayClipboardSupportError),
)

// pasteCopiedTextEpic :: Epic -> Observable Action.TEXT_PASTED
const pasteCopiedTextEpic = (action$, state$, { window }) =>
  action$.pipe(
    ofType(PASTE_GRANTED),
    map(prop("textToPaste")),
    tap(textToPaste => ifElse(
      isEmptyParagraph,
      pasteTextInParagraph(textToPaste),
      pasteTextInExistingText(textToPaste),
    )(window.getSelection())),
    map(textPasted),
    logObservableError(),
  )

// displayClipboardWarningEpic :: Epic -> Observable Action
const displayClipboardWarningEpic = action$ => action$.pipe(
  ofType(DISPLAY_CLIPBOARD_WARNING),
  tap(() => ({
    message: "Please enable clipboard access on your browser. See https://support.google.com/chrome/answer/114662",
    level: "warning",
    duration: 5000,
  })),
  logObservableError(),
)

// displayClipboardSupportErrorEpic :: Epic -> Observable Action
const displayClipboardSupportErrorEpic = action$ => action$.pipe(
  ofType(DISPLAY_CLIPBOARD_SUPPORT_ERROR),
  tap(() => ({
    message: "Your browser does not support clipboard read access. Consider to use Google Chrome which supports it.",
    level: "error",
    duration: 5000,
  })),
  logObservableError(),
)

// moveCarretAfterPastedTextEpic :: Epic -> _
const moveCarretAfterPastedTextEpic = (action$, state$, { window }) =>
  action$.pipe(
    ofType(TEXT_PASTED),
    tap(({ text }) => ifElse(
      selection => selection.anchorNode.textContent === text,
      selection => window.getSelection().collapse(selection.anchorNode, 1),
      selection => window.getSelection().collapse(
        selection.anchorNode,
        selection.anchorNode.textContent.search(text) + text.length
      ),
    )(window.getSelection())),
    ignoreElements(),
    logObservableError(),
  )

// isClipboardAccessGranted :: PermissionStatus -> Boolean
// @see https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API
const isClipboardAccessGranted = compose(equals("granted"), prop("state"))

// isTextHighlighted :: Selection -> Boolean
const isTextHighlighted = compose(equals("Range"), prop("type"))

// notTextHighlighted :: Selection -> Boolean
const notTextHighlighted = allPass([
  compose(equals("Caret"), prop("type")),
  s => equals(s.anchorNode, s.focusNode),
  s => equals(s.anchorOffset, s.focusOffset),
])

// pasteTextInParagraph :: String -> Selection -> _
const pasteTextInParagraph = textToBePasted => selection =>
  selection.anchorNode.innerHTML = textToBePasted

// pasteTextInExistingText :: String -> Selection -> _
const pasteTextInExistingText = textToBePasted => pipe(
  // currently highlighted text should be replaced by the pasted text
  rtap(when(
    isTextHighlighted,
    () => document.execCommand("delete"),
  )),
  // concat text before caret, pasted text and text after caret
  rtap(when(
    notTextHighlighted,
    s => s.anchorNode.data = join("", [
      s.anchorNode.data.slice(0, s.anchorOffset),
      textToBePasted,
      s.anchorNode.data.slice(s.anchorOffset),
    ])
  ))
)

export default combineEpics(
  checkClipboardAccessEpic,
  displayClipboardWarningEpic,
  displayClipboardSupportErrorEpic,
  moveCarretAfterPastedTextEpic,
  pasteCopiedTextEpic,
)
