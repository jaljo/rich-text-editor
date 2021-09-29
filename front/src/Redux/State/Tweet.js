import {
  always,
} from "ramda";
import {
  createReducer,
} from "../../Util";

// key: tweetId, value: originalHtmlMarkup
export const INITIAL_STATE = {
  renderedTweets: {},
};

export const RENDER_TWEET = "@knp/Tweet/RENDER_TWEET";
export const TWEET_RENDERED = "@knp/Tweet/TWEET_RENDERED";
export const CLEAR = "@knp/Tweet/CLEAR";

// renderTweet :: (String, String, String) -> Action
export const renderTweet = (tweetId, uid, originalHtmlMarkup) => ({
  originalHtmlMarkup,
  tweetId,
  type: RENDER_TWEET,
  uid,
});

// tweetRendered :: (String, String) -> Action
export const tweetRendered = (tweetId, originalHtmlMarkup) => ({
  originalHtmlMarkup,
  tweetId,
  type: TWEET_RENDERED,
});

// clear :: () -> Action
export const clear = always({ type: CLEAR });

// Tweet :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [CLEAR]: always(INITIAL_STATE),

  [TWEET_RENDERED]: (state, { tweetId, originalHtmlMarkup }) => ({
    ...state,
    renderedTweets: {
      ...state.renderedTweets,
      [tweetId]: originalHtmlMarkup,
    },
  }),
});
