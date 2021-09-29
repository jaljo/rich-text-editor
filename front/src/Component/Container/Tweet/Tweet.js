import {
  componentDidMount,
  shouldComponentUpdate,
} from "react-functional-lifecycle";
import {
  compose,
  F,
} from "ramda";
import {
  connect,
} from "react-redux";
import React from "react";
import {
  renderTweet,
} from "../../../Redux/State/Tweet";

// mapDispatchToProps :: Function -> Props
const mapDispatchToProps = dispatch => ({
  renderTweet: (tweetId, uid, originalHtmlMarkup) => dispatch(
    renderTweet(tweetId, uid, originalHtmlMarkup),
  ),
});

// didMount :: Props -> Action
const didMount = ({
  originalHtmlMarkup,
  renderTweet,
  tweetId,
  uid,
}) => renderTweet(tweetId, uid, originalHtmlMarkup);

// View :: Props -> React.Component
const View = ({
  uid,
}) =>
  <div id={ `tweet-${ uid }` }></div>;

// lifecycles :: React.Component -> React.Component
const lifecycles = compose(
  componentDidMount(didMount),
  shouldComponentUpdate(F),
)(View);

// Tweet :: Props -> React.Component
export default connect(
  null,
  mapDispatchToProps,
)(lifecycles);
