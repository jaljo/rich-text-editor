import InsertTweet from '../../View/TextEditor/InsertTweet'
import { connect } from 'react-redux'
import { compose, pipe, prop, tap } from 'ramda'
import { componentDidMount, componentWillUnmount } from 'react-functional-lifecycle'
import { clear, initialize, insertTweet } from '../../../Redux/State/TextEditor/InsertTweet'

// mapStateToProps :: (State, Props) -> Props
const mapStateToProps = (state, props) => ({
  error: prop('error', state.TextEditor.InsertTweet[props.editorName]),
  fetching: prop('fetching', state.TextEditor.InsertTweet[props.editorName]),
})

// mapDispatchToProps :: (Action * -> State, Props) -> Props
const mapDispatchToProps = (dispatch, props) => ({
  clear: compose(dispatch, clear),
  initialize: compose(dispatch, initialize),
  submit: pipe(
    tap(e => e.preventDefault()),
    tap(e => e.stopPropagation()),
    e => dispatch(insertTweet(props.editorName, e.target.tweetLink.value)),
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
)(InsertTweet)

// ParagraphToolbox :: Props -> React.Component
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(lifecycles)
