import {
  clear,
  fetchImages,
  pickImage,
  scrollLeft,
  scrollRight,
} from '../../../Redux/State/MediaPicker/ImagePicker'
import {
  componentDidMount,
  componentWillUnmount,
} from 'react-functional-lifecycle'
import {
  compose,
} from 'ramda'
import {
  connect,
} from 'react-redux'
import ImagePicker from '../../View/MediaPicker/ImagePicker'

// mapStateToProps :: State -> Props
const mapStateToProps = state => ({
  domain: state.MediaPicker.Display.domain,
  error: state.MediaPicker.ImagePicker.error,
  extra: state.MediaPicker.Display.extra,
  images: state.MediaPicker.ImagePicker.images,
  isFetching: state.MediaPicker.ImagePicker.isFetching,
  page: state.MediaPicker.ImagePicker.page,
})

// mapDispatchToProps :: (Action * -> State) -> Props
const mapDispatchToProps = dispatch => ({
  clear: compose(dispatch, clear),
  initialLoad: compose(dispatch, fetchImages),
  pickImage: compose (dispatch, pickImage),
  scrollLeft: compose(dispatch, scrollLeft),
  scrollRight: compose(dispatch, scrollRight),
})

// onMount :: Props -> Action
const onMount = ({ initialLoad }) => initialLoad()

// willUnmount :: Props -> Action
const willUnmount = ({ clear }) => clear()

// imagePickerLifecycles :: React.Component -> React.Component
const imagePickerLifecycles = compose(
  componentDidMount(onMount),
  componentWillUnmount(willUnmount),
)(ImagePicker)

// MediaPicker :: Props -> React.Component
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(imagePickerLifecycles)
