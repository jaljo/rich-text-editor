import {
  clear,
  RENDER_TWEET,
  tweetRendered,
} from './../Redux/State/Tweet'
import {
  combineEpics,
  ofType,
} from 'redux-observable'
import {
  filter,
  map,
  mergeMap,
} from 'rxjs/operators'
import {
  CLEAR,
} from './../Redux/State/TextEditor/TextEditor'
import {
  logObservableError,
} from '../Util'
import {
  prop,
} from 'ramda'


// renderTweetEpic :: (Observable Action Error, Observable State Error, Object) -> Observable Action _
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
