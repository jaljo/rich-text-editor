import TextToolbox from './TextToolbox'
import ParagraphToolbox from './ParagraphToolbox'
import InsertTweet from './InsertTweet'
import InsertYoutubeVideo from './InsertYoutubeVideo'
import { combineReducers } from 'redux'
import { always } from 'ramda'

// TextEditor actions types
export const CLICK = '@i24/TextEditor/CLICK'
export const KEY_DOWN = '@i24/TextEditor/KEY_DOWN'
export const SELECT_TEXT = '@i24/TextEditor/SELECT_TEXT'
export const PASTE = '@i24/TextEditor/PASTE'
export const PASTE_GRANTED = '@i24/TextEditor/PASTE_GRANTED'
export const DISPLAY_CLIPBOARD_WARNING = '@i24/TextEditor/DISPLAY_ERROR_WARNING'
export const DISPLAY_CLIPBOARD_SUPPORT_ERROR = '@i24/TextEditor/DISPLAY_CLIPBOARD_SUPPORT_ERROR'
export const TEXT_PASTED = '@i24/TextEditor/TEXT_PASTED'
export const CLEAR = '@i24/TextEditor/CLEAR'
export const INITIALIZE = '@i24/TextEditor/INITIALIZE'

// click :: (String, Node) -> Action.CLICK
export const click = (editorName, node) => ({
  type: CLICK,
  editorName,
  node,
})

// keyDown :: (String, Number) -> Action.KEY_DOWN
export const keyDown = (editorName, keyCode) => ({
  type: KEY_DOWN,
  editorName,
  keyCode,
})

// selectText :: String -> Action.SELECT_TEXT
export const selectText = editorName => ({
  type: SELECT_TEXT,
  editorName,
})

// paste :: () -> Action.PASTE
export const paste = always({ type: PASTE })

// pasteGranted :: String -> Action.PASTE_GRANTED
export const pasteGranted = textToPaste => ({
  type: PASTE_GRANTED,
  textToPaste,
})

// displayClipboardWarning :: () -> Action.DISPLAY_CLIPBOARD_WARNING
export const displayClipboardWarning = always({ type: DISPLAY_CLIPBOARD_WARNING })

// displayClipboardSupportError :: () -> Action.DISPLAY_CLIPBOARD_SUPPORT_ERROR
export const displayClipboardSupportError = always({ type: DISPLAY_CLIPBOARD_SUPPORT_ERROR })

// textPasted :: String -> Action.TEXT_PASTED
export const textPasted = text => ({
  type: TEXT_PASTED,
  text,
})

// clear :: () -> Action.CLEAR
export const clear = always({ type: CLEAR })

// initialize :: () -> Action.INITIALIZE
export const initialize = always({ type: INITIALIZE })

export default combineReducers({
  TextToolbox,
  ParagraphToolbox,
  InsertTweet,
  InsertYoutubeVideo,
})
