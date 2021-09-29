import {
  compose,
  map,
} from "ramda";
import {
  componentDidMount,
} from "react-functional-lifecycle";
import {
  connect,
} from "react-redux";
import {
  loadPlayer,
} from "../../../Redux/State/BrightcovePlayer";
import {
  locales,
} from "../../../Const";
import React from "react";

// mapDispatchToProps :: (Action * -> State) -> Props
const mapDispatchToProps = dispatch => ({
  loadAllPlayers: map(
    compose(dispatch, loadPlayer),
  ),
});

// didMount :: Props -> Action.LOAD_PLAYER
const didMount = ({ loadAllPlayers }) => loadAllPlayers(locales);

// View :: () -> React.Component
const View = () => <span data-is="brightcove-players"/>;

// lifecycles :: null -> React.Component
const lifecycles = compose(
  componentDidMount(didMount),
)(View);

// BrightcovePlayer :: Props -> React.Component
export default connect(
  null,
  mapDispatchToProps,
)(lifecycles);
