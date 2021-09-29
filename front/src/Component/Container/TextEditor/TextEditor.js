import {
  clear,
  click,
  initialize,
  keyDown,
  paste,
  selectText,
} from "../../../Redux/State/TextEditor/TextEditor";
import {
  componentDidMount,
  componentWillUnmount,
} from "react-functional-lifecycle";
import {
  compose,
  equals,
  isNil,
  pipe,
  prop,
  tap,
  when,
} from "ramda";
import {
  connect,
} from "react-redux";
import TextEditor from "../../View/TextEditor/TextEditor";

// mapDispatchToProps :: (Action * -> State, Props) -> Props
const mapDispatchToProps = (dispatch, props) => ({
  clear: compose(dispatch, clear),
  click: compose(dispatch, click),
  initialize: compose(dispatch, initialize),
  keyDown: pipe(
    when(
      compose(equals(13), prop("keyCode")),
      tap(e => e.preventDefault()),
    ),
    e => keyDown(props.editorName, e.keyCode),
    dispatch,
  ),
  paste: pipe(
    tap(e => e.preventDefault()),
    paste,
    dispatch,
  ),
  selectText: compose(dispatch, selectText),
});

// didMount :: Props -> Action.INITIALIZE
const didMount = ({ initialize }) => initialize();

// willUnmount :: Props -> Action
const willUnmount = ({ clear, main }) => !isNil(main) && clear();

// lifecycles :: React.Component -> React.Component
const lifecycles = compose(
  componentDidMount(didMount),
  componentWillUnmount(willUnmount),
)(TextEditor);

// TextEditor :: Props -> React.Component
export default connect(
  null,
  mapDispatchToProps,
)(lifecycles);
