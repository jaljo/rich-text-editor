import {
  clear,
  closeLinkCreator,
  initialize,
  mutate,
  openLinkCreator,
} from "../../../Redux/State/TextEditor/TextToolbox";
import {
  componentDidMount,
  componentWillUnmount,
} from "react-functional-lifecycle";
import {
  compose,
  equals,
  ifElse,
  pipe,
  prop,
} from "ramda";
import {
  connect,
} from "react-redux";
import TextToolbox from "../../View/TextEditor/TextToolbox";
import {
  whenValid,
} from "../../../Util";

// mapStateToProps :: (State, Props) -> Props
const mapStateToProps = (state, props) => ({
  isBold: prop("isBold", state.TextEditor.TextToolbox[props.editorName]),
  isItalic: prop("isItalic", state.TextEditor.TextToolbox[props.editorName]),
  isLink: prop("isLink", state.TextEditor.TextToolbox[props.editorName]),
  isLinkCreatorOpened: prop("isLinkCreatorOpened", state.TextEditor.TextToolbox[props.editorName]),
  isQuote: prop("isQuote", state.TextEditor.TextToolbox[props.editorName]),
  isTitle: prop("isTitle", state.TextEditor.TextToolbox[props.editorName]),
  isUnderline: prop("isUnderline", state.TextEditor.TextToolbox[props.editorName]),
  isVisible: prop("visible", state.TextEditor.TextToolbox[props.editorName]),
  top: prop("top", state.TextEditor.TextToolbox[props.editorName]),
});

// mapDispatchToProps :: (Action * -> State, Props) -> Props
const mapDispatchToProps = (dispatch, props) => ({
  clear: () => dispatch(clear(props.editorName)),
  closeLinkCreator: () => dispatch(closeLinkCreator(props.editorName)),
  handleLinkButton: pipe(
    ifElse(
      equals("LINK"),
      () => openLinkCreator(props.editorName),
      () => mutate(props.editorName)("UNLINK"),
    ),
    dispatch,
  ),
  handleLinkForm: whenValid(pipe(
    getFormData,
    data => mutate(props.editorName)("LINK", data),
    dispatch,
  )),
  initialize: () => dispatch(initialize(props.editorName)),
  mutate: compose(dispatch, mutate(props.editorName)),
});

// getFormData :: Element -> Object
const getFormData = formElement => ({
  href: formElement.href.value,
});

// didMount :: Props -> Action.INITIALIZE
const didMount = ({ initialize }) => initialize();

// willUnmount :: Props -> Action.CLEAR
const willUnmount = ({ clear }) => clear();

// lifecycles :: React.Component -> React.Component
const lifecycles = compose(
  componentDidMount(didMount),
  componentWillUnmount(willUnmount),
)(TextToolbox);

// TextToolbox :: Props -> React.Component
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(lifecycles);
