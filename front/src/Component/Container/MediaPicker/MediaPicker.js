import { connect } from 'react-redux'
import { compose, path } from 'ramda'
import {
  close,
  openImagePicker,
  clear,
  openVideoPicker,
} from '../../../Redux/State/MediaPicker/MediaPicker'
import { fetchImages } from '../../../Redux/State/MediaPicker/ImagePicker'
import { searchVideos } from '../../../Redux/State/MediaPicker/VideoPicker'
import MediaPicker from '../../View/MediaPicker/MediaPicker'
import { componentWillUnmount } from 'react-functional-lifecycle'

// mapStateToProps :: State -> Props
const mapStateToProps = state => ({
  isOpened: state.MediaPicker.Display.opened,
  isFetchingImages: state.MediaPicker.ImagePicker.isFetching,
  isFetchingVideos: state.MediaPicker.VideoPicker.isFetching,
  isImagePickerOpened: state.MediaPicker.Display.imagePickerOpened,
  isVideoPickerOpened: state.MediaPicker.Display.videoPickerOpened,
})

// mapDispatchToProps :: (Action * -> State) -> Props
const mapDispatchToProps = dispatch => ({
  close: compose(dispatch, close),
  searchImages: compose(dispatch, fetchImages, path(['target', 'value'])),
  searchVideos: compose(dispatch, searchVideos, path(['target', 'value'])),
  openImagePicker: compose(dispatch, openImagePicker),
  clear: compose(dispatch, clear),
  openVideoPicker: compose(dispatch, openVideoPicker),
})

// willUnmount :: Props -> Action.CLEAR
const willUnmount = ({ clear }) => clear()

// lifecycles :: React.Component -> React.Component
const lifecycles = compose(
  componentWillUnmount(willUnmount),
)(MediaPicker)

// MediaPicker :: Props -> React.Component
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(lifecycles)
