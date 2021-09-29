import {
  compose,
  F,
} from "ramda";
import {
  shouldComponentUpdate,
} from "react-functional-lifecycle";
import Widget from "../../View/TextEditor/Widget";

// Widget :: Props -> React.Component
export default compose(
  shouldComponentUpdate(F),
)(Widget);
