import { RENDER_TWEET, clear, tweetRendered } from './../Redux/State/Tweet'
import { ofType } from 'redux-observable'
import { filter, mergeMap, map } from 'rxjs/operators'
import { combineEpics } from 'redux-observable'
import { prop } from 'ramda'
import { logObservableError } from '../Util'
import { CLEAR } from './../Redux/State/TextEditor/TextEditor'

/**
 * Renders an embed tweet markup to a fancy tweet.
 *
 * See this i24news article for a tweet :
 * /en/news/international/americas/157278-171009-top-republican-lawmaker-says-us-on-course-for-wwiii-with-trump-at-helm
 *
 * renderTweetEpic :: (Observable Action Error, Observable State Error, Object) -> Observable Action _
 */
export const renderTweetEpic = (action$, state$, { window }) =>
  action$.pipe(
    ofType(RENDER_TWEET),
    filter(() => window.twttr),
    map(action => ({
      ...action,
      element: document.getElementById(`tweet-${action.uid}`),
    })),
    filter(prop('element')),
    mergeMap(({ tweetId, originalHtmlMarkup, element }) => Promise.all([
      tweetId,
      originalHtmlMarkup,
      window.twttr.widgets.createTweet(tweetId, element),
    ])),
    map(([ tweetId, originalHtmlMarkup ]) => tweetRendered(tweetId, originalHtmlMarkup)),
    logObservableError(),
  )

/**
 * Clear the rendered tweets original markups when the text editor is unmounted.
 *
 * clearRenderedTweetsEpic :: Observable Action Error -> Observable Action _
 */
export const clearRenderedTweetsEpic = action$ =>
  action$.pipe(
    ofType(CLEAR),
    map(clear),
    logObservableError(),
  )

export default combineEpics(
  renderTweetEpic,
  clearRenderedTweetsEpic,
)
