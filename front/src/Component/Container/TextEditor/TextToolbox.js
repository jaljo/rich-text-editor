import TextToolbox from '../../View/TextEditor/TextToolbox'
import { connect } from 'react-redux'
import { compose, equals, ifElse, pipe, prop } from 'ramda'
import { componentDidMount, componentWillUnmount } from 'react-functional-lifecycle'
import { whenValid } from '../../../Util'
import {
  initialize,
  clear,
  openLinkCreator,
  closeLinkCreator,
  mutate,
} from '../../../Redux/State/TextEditor/TextToolbox'

// mapStateToProps :: (State, Props) -> Props
const mapStateToProps = (state, props) => ({
  isVisible: prop('visible', state.TextEditor.TextToolbox[props.editorName]),
  top: prop('top', state.TextEditor.TextToolbox[props.editorName]),
  isLinkCreatorOpened: prop('isLinkCreatorOpened', state.TextEditor.TextToolbox[props.editorName]),
  isBold: prop('isBold', state.TextEditor.TextToolbox[props.editorName]),
  isItalic: prop('isItalic', state.TextEditor.TextToolbox[props.editorName]),
  isUnderline: prop('isUnderline', state.TextEditor.TextToolbox[props.editorName]),
  isTitle: prop('isTitle', state.TextEditor.TextToolbox[props.editorName]),
  isQuote: prop('isQuote', state.TextEditor.TextToolbox[props.editorName]),
  isLink: prop('isLink', state.TextEditor.TextToolbox[props.editorName]),
})

// mapDispatchToProps :: (Action * -> State, Props) -> Props
const mapDispatchToProps = (dispatch, props) => ({
  initialize: () => dispatch(initialize(props.editorName)),
  clear: () => dispatch(clear(props.editorName)),
  handleLinkButton: pipe(
    ifElse(
      equals('LINK'),
      () => openLinkCreator(props.editorName),
      () => mutate(props.editorName)('UNLINK'),
    ),
    dispatch,
  ),
  handleLinkForm: whenValid(pipe(
    getFormData,
    data => mutate(props.editorName)('LINK', data),
    dispatch,
  )),
  closeLinkCreator: () => dispatch(closeLinkCreator(props.editorName)),
  mutate: compose(dispatch, mutate(props.editorName)),
})

// getFormData :: Element -> Object
const getFormData = formElement => ({
  href: formElement.href.value,
})

// didMount :: Props -> Action.INITIALIZE
const didMount = ({ initialize }) => initialize()

// willUnmount :: Props -> Action.CLEAR
const willUnmount = ({ clear }) => clear()

// lifecycles :: React.Component -> React.Component
const lifecycles = compose(
  componentDidMount(didMount),
  componentWillUnmount(willUnmount),
)(TextToolbox)

// TextToolbox :: Props -> React.Component
export default connect(
   mapStateToProps,
   mapDispatchToProps,
)(lifecycles)
