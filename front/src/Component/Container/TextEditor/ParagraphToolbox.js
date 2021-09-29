import ParagraphToolbox from '../../View/TextEditor/ParagraphToolbox'
import { connect } from 'react-redux'
import { compose, prop } from 'ramda'
import { componentDidMount, componentWillUnmount } from 'react-functional-lifecycle'
import { open as openMediaPicker } from '../../../Redux/State/MediaPicker/MediaPicker'
import {
  clear,
  closeInsertTweet,
  initialize,
  openInsertTweet,
  openInsertYoutubeVideo,
  closeInsertYoutubeVideo,
} from '../../../Redux/State/TextEditor/ParagraphToolbox'

// mapStateToProps :: (State, Props) -> Props
const mapStateToProps = (state, props) => ({
  insertTweetOpened: prop('insertTweetOpened', state.TextEditor.ParagraphToolbox[props.editorName]),
  insertYoutubeVideoOpened: prop('insertYoutubeVideoOpened', state.TextEditor.ParagraphToolbox[props.editorName]),
  isVisible: prop('visible', state.TextEditor.ParagraphToolbox[props.editorName]),
  mediaPickerOpened: state.MediaPicker.Display.opened && state.MediaPicker.Display.domain === 'TEXT_EDITOR',
  top: prop('top', state.TextEditor.ParagraphToolbox[props.editorName]),
})

// mapDispatchToProps :: (Action * -> State, Props) -> Props
const mapDispatchToProps = (dispatch, props) => ({
  clear: () => dispatch(clear(props.editorName)),
  closeInsertTweet: () => dispatch(closeInsertTweet(props.editorName)),
  closeInsertYoutubeVideo: () => dispatch(closeInsertYoutubeVideo(props.editorName)),
  initialize: () => dispatch(initialize(props.editorName)),
  openInsertTweet: () => dispatch(openInsertTweet(props.editorName)),
  openInsertYoutubeVideo: () => dispatch(openInsertYoutubeVideo(props.editorName)),
  openMediaPicker: (domain, extra, defaultOpenedComponent) => dispatch(
    openMediaPicker(domain, extra, defaultOpenedComponent),
  ),
})

// didMount :: Props -> Action.INITIALIZE
const didMount = ({ initialize }) => initialize()

// willUnmount :: Props -> Action.CLEAR
const willUnmount = ({ clear }) => clear()

// lifecycles :: React.Component -> React.Component
const lifecycles = compose(
  componentDidMount(didMount),
  componentWillUnmount(willUnmount),
)(ParagraphToolbox)

// ParagraphToolbox :: Props -> React.Component
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(lifecycles)
