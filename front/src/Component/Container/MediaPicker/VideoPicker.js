import VideoPicker from '../../View/MediaPicker/VideoPicker'
import { componentDidMount, componentWillUnmount } from 'react-functional-lifecycle'
import { compose } from 'ramda'
import { connect } from 'react-redux'
import {
  fetchVideos,
  scrollLeft,
  scrollRight,
  pickVideo,
  clear,
} from '../../../Redux/State/MediaPicker/VideoPicker'

// mapStateToProps :: State -> Props
const mapStateToProps = state => ({
  domain: state.MediaPicker.Display.domain,
  extra: state.MediaPicker.Display.extra,
  page: state.MediaPicker.VideoPicker.page,
  videos: state.MediaPicker.VideoPicker.videos,
})

// mapDispatchToProps :: (Action * -> State) -> Props
const mapDispatchToProps = dispatch => ({
  clear: compose(dispatch, clear),
  fetchVideos: compose(dispatch, fetchVideos),
  pickVideo: compose(dispatch, pickVideo),
  scrollLeft: compose(dispatch, scrollLeft),
  scrollRight: compose(dispatch, scrollRight),
})

// didMount :: Props -> Action.FETCH_VIDEOS
const didMount = ({ fetchVideos }) => fetchVideos()

// willUnmount :: Props -> Action
const willUnmount = ({ clear }) => clear()

// lifecycle :: React.Component -> React.Component
const lifecycles = compose(
  componentDidMount(didMount),
  componentWillUnmount(willUnmount),
)(VideoPicker)

// VideoPicker :: Props -> React.Component
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(lifecycles)
