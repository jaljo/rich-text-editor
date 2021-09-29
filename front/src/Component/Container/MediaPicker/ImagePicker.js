import { connect } from "react-redux"
import { compose } from "ramda"
import { componentDidMount, componentWillUnmount } from "react-functional-lifecycle"
import ImagePicker from "../../View/MediaPicker/ImagePicker"
import {
  fetchImages,
  scrollLeft,
  scrollRight,
  pickImage,
  clear,
} from "../../../Redux/State/MediaPicker/ImagePicker"

// mapStateToProps :: State -> Props
const mapStateToProps = state => ({
  images: state.MediaPicker.ImagePicker.images,
  page: state.MediaPicker.ImagePicker.page,
  domain: state.MediaPicker.Display.domain,
  extra: state.MediaPicker.Display.extra,
  error: state.MediaPicker.ImagePicker.error,
  isFetching: state.MediaPicker.ImagePicker.isFetching,
})

// mapDispatchToProps :: (Action * -> State) -> Props
const mapDispatchToProps = dispatch => ({
  initialLoad: compose(dispatch, fetchImages),
  scrollLeft: compose(dispatch, scrollLeft),
  scrollRight: compose(dispatch, scrollRight),
  pickImage: compose (dispatch, pickImage),
  clear: compose(dispatch, clear),
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
