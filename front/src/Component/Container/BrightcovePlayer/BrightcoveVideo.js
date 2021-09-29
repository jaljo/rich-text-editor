import BrightcoveVideo from "../../View/BrightcovePlayer/BrightcoveVideo"
import { connect } from "react-redux"
import { brightcovePlayerIds } from "../../../Const"
import { componentDidMount, componentDidUpdate, componentWillUnmount } from "react-functional-lifecycle"
import { compose } from "ramda"
import { renderVideo, removeVideo } from "../../../Redux/State/BrightcovePlayer"

// mapStateToProps :: State -> Props
const mapStateToProps = state => ({
  playerId: brightcovePlayerIds[state.Router.params.locale],
  isReady: state.BrightcovePlayer[`${state.Router.params.locale}PlayerReady`],
  accountId: process.env.REACT_APP_BRIGHTCOVE_ACCOUNT_ID,
})

// mapDispatchToProps :: (Action * -> State) -> Props
const mapDispatchToProps = dispatch => ({
  renderVideo: compose(dispatch, renderVideo),
  removeVideo: compose(dispatch, removeVideo),
})

// didMountOrUpdate :: Props -> Action.VIDEO_RENDERED
const didMountOrUpdate = ({ renderVideo, videoId }) => renderVideo(videoId)

// willUnmount :: Props -> Action.REMOVE_VIDEO
const willUnmount = ({ removeVideo, videoId }) => removeVideo(videoId)

// lifecycles :: React.Component -> React.Component
const lifecycles = compose(
  componentDidMount(didMountOrUpdate),
  componentDidUpdate(didMountOrUpdate),
  componentWillUnmount(willUnmount),
)(BrightcoveVideo)

// BrightcoveVideo :: Props -> React.Component
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(lifecycles)
