import InsertYoutubeVideo from "../../View/TextEditor/InsertYoutubeVideo"
import { connect } from "react-redux"
import { clear, initialize, insertYoutubeVideo } from "../../../Redux/State/TextEditor/InsertYoutubeVideo"
import { apply, compose, path, pipe, tap, prop } from "ramda"
import { componentDidMount, componentWillUnmount } from "react-functional-lifecycle"

// mapStateToProps :: (State, Props) -> Props
const mapStateToProps = (state, props) => ({
  error: prop("error", state.TextEditor.InsertYoutubeVideo[props.editorName]),
})

// mapDispatchToProps :: (Action * -> State, Props) -> Props
const mapDispatchToProps = (dispatch, props) => ({
  clear: compose(dispatch, clear),
  initialize: compose(dispatch, initialize),
  submit: pipe(
    tap(e => e.preventDefault()),
    tap(e => e.stopPropagation()),
    e => [ props.editorName, path(["target", "youtubeLink", "value"], e) ],
    apply(insertYoutubeVideo),
    dispatch,
  ),
})

// didMount :: Props -> Action
const didMount = ({ editorName, initialize }) => initialize(editorName)

// willUnmount :: Props -> Action
const willUnmount = ({ clear, editorName }) => clear(editorName)

// lifecycles :: React.Component -> React.Component
const lifecycles = compose(
  componentDidMount(didMount),
  componentWillUnmount(willUnmount),
)(InsertYoutubeVideo)

// InsertYoutube :: Props -> React.Component
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(lifecycles)
