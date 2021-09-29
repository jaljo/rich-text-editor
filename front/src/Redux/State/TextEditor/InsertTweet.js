import {
  createReducer,
} from "../../../Util";
import {
  omit,
} from "ramda";

// InsertTweet initial state
export const INSTANCE_INITIAL_STATE = {
  error: false,
  fetching: false,
};

export const INITIAL_STATE = {};

// InsertTweet action types
export const INITIALIZE = "@knp/TextEditor/InsertTweet/INITIALIZE";
export const INSERT_TWEET = "@knp/TextEditor/InsertTweet/INSERT_TWEET";
export const EMBED_TWEET_FETCHED = "@knp/TextEditor/InsertTweet/EMBED_TWEET_FETCHED";
export const TWEET_INSERTED = "@knp/TextEditor/InsertTweet/TWEET_INSERTED";
export const ERROR = "@knp/TextEditor/InsertTweet/ERROR";
export const CLEAR = "@knp/TextEditor/InsertTweet/CLEAR";

// initialize :: String -> Action
export const initialize = editorName => ({
  editorName,
  type: INITIALIZE,
});

// insertTweet :: (String, String) -> Action
export const insertTweet = (editorName, url) => ({
  editorName,
  type: INSERT_TWEET,
  url,
});

// embedTweetFetched :: (String, String, String) -> Action.EMBED_TWEET_FETCHED
export const embedTweetFetched = (editorName, html, url) => ({
  editorName,
  html,
  type: EMBED_TWEET_FETCHED,
  url,
});

// tweetInserted :: (String, String, String, String) -> Action
export const tweetInserted = (editorName, tweetId, uid, markup) => ({
  editorName,
  originalHtmlMarkup: markup,
  tweetId,
  type: TWEET_INSERTED,
  uid,
});

// error :: String -> Action
export const error = editorName => ({
  editorName,
  type: ERROR,
});

// clear :: String -> Action
export const clear = editorName => ({
  editorName,
  type: CLEAR,
});

// InsertTweet :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [CLEAR]: (state, { editorName }) => omit([editorName], state),

  [EMBED_TWEET_FETCHED]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      fetching: false,
    },
  }),

  [ERROR]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      error: true,
      fetching: false,
    },
  }),

  [INITIALIZE]: (state, { editorName }) => ({
    ...state,
    [editorName]: { ...INSTANCE_INITIAL_STATE },
  }),

  [INSERT_TWEET]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      error: false,
      fetching: true,
    },
  }),
});
