import { combineEpics } from 'redux-observable'
import BrightcovePlayer from './BrightcovePlayer'
import ImagePicker from './MediaPicker/ImagePicker'
import InsertTweet from './TextEditor/InsertTweet'
import InsertYoutubeVideo from './TextEditor/InsertYoutubeVideo'
import MediaPicker from './MediaPicker/MediaPicker'
import PasteText from './TextEditor/PasteText'
import TextEditor from './TextEditor/TextEditor'
import ToolBoxes from './TextEditor/ToolBoxes'
import Tweet from './Tweet'
import VideoPicker from './MediaPicker/VideoPicker'

// Epic :: (Observable Action, Observable State) -> Observable Action
export default combineEpics(
  BrightcovePlayer,
  ImagePicker,
  InsertTweet,
  InsertYoutubeVideo,
  MediaPicker,
  PasteText,
  TextEditor,
  ToolBoxes,
  Tweet,
  VideoPicker,
)
