import { createReducer } from '../../../Util'
import { omit } from 'ramda'

// InsertTweet initial state
export const INSTANCE_INITIAL_STATE = {
  error: false,
  fetching: false,
}

export const INITIAL_STATE = {}

// InsertTweet action types
export const INITIALIZE = '@knp/TextEditor/InsertTweet/INITIALIZE'
export const INSERT_TWEET = '@knp/TextEditor/InsertTweet/INSERT_TWEET'
export const EMBED_TWEET_FETCHED = '@knp/TextEditor/InsertTweet/EMBED_TWEET_FETCHED'
export const TWEET_INSERTED = '@knp/TextEditor/InsertTweet/TWEET_INSERTED'
export const ERROR = '@knp/TextEditor/InsertTweet/ERROR'
export const CLEAR = '@knp/TextEditor/InsertTweet/CLEAR'

// initialize :: String -> Action
export const initialize = editorName => ({
  type: INITIALIZE,
  editorName,
})

// insertTweet :: (String, String) -> Action
export const insertTweet = (editorName, url) => ({
  type: INSERT_TWEET,
  editorName,
  url,
})

// embedTweetFetched :: (String, String, String) -> Action.EMBED_TWEET_FETCHED
export const embedTweetFetched = (editorName, html, url) => ({
  type: EMBED_TWEET_FETCHED,
  editorName,
  html,
  url,
})

// tweetInserted :: (String, String, String, String) -> Action
export const tweetInserted = (editorName, tweetId, uid, originalHtmlMarkup) => ({
  type: TWEET_INSERTED,
  editorName,
  tweetId,
  uid,
  originalHtmlMarkup,
})

// error :: String -> Action
export const error = editorName => ({
  type: ERROR,
  editorName,
})

// clear :: String -> Action
export const clear = editorName => ({
  type: CLEAR,
  editorName,
})

// InsertTweet :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [INITIALIZE]: (state, { editorName }) => ({
    ...state,
    [editorName]: {...INSTANCE_INITIAL_STATE},
  }),

  [INSERT_TWEET]: (state, { editorName }) => ({
    ...state,
    [editorName]: {
      ...state[editorName],
      error: false,
      fetching: true,
    },
  }),

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

  [CLEAR]: (state, { editorName }) => omit([editorName], state),
})
