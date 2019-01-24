import Widget from '../../View/TextEditor/Widget'
import { shouldComponentUpdate } from 'react-functional-lifecycle'
import { compose, F } from 'ramda'

// Widget :: Props -> React.Component
export default compose(
  shouldComponentUpdate(F),
)(Widget);
