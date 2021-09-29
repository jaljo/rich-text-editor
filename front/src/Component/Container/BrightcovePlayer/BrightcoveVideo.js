import {
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from "react-functional-lifecycle";
import {
  removeVideo,
  renderVideo,
} from "../../../Redux/State/BrightcovePlayer";
import {
  brightcovePlayerIds,
} from "../../../Const";
import BrightcoveVideo from "../../View/BrightcovePlayer/BrightcoveVideo";
import {
  compose,
} from "ramda";
import {
  connect,
} from "react-redux";

// mapStateToProps :: State -> Props
const mapStateToProps = state => ({
  accountId: process.env.REACT_APP_BRIGHTCOVE_ACCOUNT_ID,
  isReady: state.BrightcovePlayer[`${state.Router.params.locale}PlayerReady`],
  playerId: brightcovePlayerIds[state.Router.params.locale],
});

// mapDispatchToProps :: (Action * -> State) -> Props
const mapDispatchToProps = dispatch => ({
  removeVideo: compose(dispatch, removeVideo),
  renderVideo: compose(dispatch, renderVideo),
});

// didMountOrUpdate :: Props -> Action.VIDEO_RENDERED
const didMountOrUpdate = ({ renderVideo, videoId }) => renderVideo(videoId);

// willUnmount :: Props -> Action.REMOVE_VIDEO
const willUnmount = ({ removeVideo, videoId }) => removeVideo(videoId);

// lifecycles :: React.Component -> React.Component
const lifecycles = compose(
  componentDidMount(didMountOrUpdate),
  componentDidUpdate(didMountOrUpdate),
  componentWillUnmount(willUnmount),
)(BrightcoveVideo);

// BrightcoveVideo :: Props -> React.Component
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(lifecycles);
