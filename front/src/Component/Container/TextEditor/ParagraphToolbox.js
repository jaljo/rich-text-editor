import {
  clear,
  closeInsertTweet,
  closeInsertYoutubeVideo,
  initialize,
  openInsertTweet,
  openInsertYoutubeVideo,
} from "../../../Redux/State/TextEditor/ParagraphToolbox";
import {
  componentDidMount,
  componentWillUnmount,
} from "react-functional-lifecycle";
import {
  compose,
  prop,
} from "ramda";
import {
  connect,
} from "react-redux";
import {
  open as openMediaPicker,
} from "../../../Redux/State/MediaPicker/MediaPicker";
import ParagraphToolbox from "../../View/TextEditor/ParagraphToolbox";

// mapStateToProps :: (State, Props) -> Props
const mapStateToProps = (state, { editorName }) => ({
  insertTweetOpened: prop(
    "insertTweetOpened",
    state.TextEditor.ParagraphToolbox[editorName],
  ),
  insertYoutubeVideoOpened: prop(
    "insertYoutubeVideoOpened",
    state.TextEditor.ParagraphToolbox[editorName],
  ),
  isVisible: prop(
    "visible",
    state.TextEditor.ParagraphToolbox[editorName],
  ),
  mediaPickerOpened:
    state.MediaPicker.Display.opened
    && state.MediaPicker.Display.domain === "TEXT_EDITOR"
  ,
  top: prop("top", state.TextEditor.ParagraphToolbox[editorName]),
});

// mapDispatchToProps :: (Action * -> State, Props) -> Props
const mapDispatchToProps = (dispatch, { editorName }) => ({
  clear: () => dispatch(clear(editorName)),
  closeInsertTweet: () => dispatch(closeInsertTweet(editorName)),
  closeInsertYoutubeVideo: () => dispatch(closeInsertYoutubeVideo(editorName)),
  initialize: () => dispatch(initialize(editorName)),
  openInsertTweet: () => dispatch(openInsertTweet(editorName)),
  openInsertYoutubeVideo: () => dispatch(openInsertYoutubeVideo(editorName)),
  openMediaPicker: (domain, extra, defaultOpenedComponent) => dispatch(
    openMediaPicker(domain, extra, defaultOpenedComponent),
  ),
});

// didMount :: Props -> Action.INITIALIZE
const didMount = ({ initialize }) => initialize();

// willUnmount :: Props -> Action.CLEAR
const willUnmount = ({ clear }) => clear();

// lifecycles :: React.Component -> React.Component
const lifecycles = compose(
  componentDidMount(didMount),
  componentWillUnmount(willUnmount),
)(ParagraphToolbox);

// ParagraphToolbox :: Props -> React.Component
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(lifecycles);
