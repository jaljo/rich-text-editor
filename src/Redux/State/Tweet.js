import { createReducer } from '../../Util'
import { always } from 'ramda'

export const INITIAL_STATE = {
  renderedTweets: {}, // key: tweetId, value: originalHtmlMarkup
}

export const RENDER_TWEET = '@i24/Tweet/RENDER_TWEET'
export const TWEET_RENDERED = '@i24/Tweet/TWEET_RENDERED'
export const CLEAR = '@i24/Tweet/CLEAR'

// renderTweet :: (String, String, String) -> Action
export const renderTweet = (tweetId, uid, originalHtmlMarkup) => ({
  type: RENDER_TWEET,
  tweetId,
  uid,
  originalHtmlMarkup,
})

// tweetRendered :: (String, String) -> Action
export const tweetRendered = (tweetId, originalHtmlMarkup) => ({
  type: TWEET_RENDERED,
  tweetId,
  originalHtmlMarkup,
})

// clear :: () -> Action
export const clear = always({ type: CLEAR })

// Tweet :: (State, Action *) -> State
export default createReducer(INITIAL_STATE, {
  [TWEET_RENDERED]: (state, { tweetId, originalHtmlMarkup }) => ({
    ...state,
    renderedTweets: {
      ...state.renderedTweets,
      [tweetId]: originalHtmlMarkup,
    },
  }),

  [CLEAR]: always(INITIAL_STATE),
})
