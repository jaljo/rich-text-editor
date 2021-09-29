import {
  apply,
  compose,
  equals,
  ifElse,
  path,
  pipe,
  prop,
  tap,
} from 'ramda'
import {
  catchError,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators'
import {
  closeInsertTweet,
  OPEN_INSERT_YOUTUBE_VIDEO,
} from '../../Redux/State/TextEditor/ParagraphToolbox'
import {
  combineEpics,
  ofType,
} from 'redux-observable'
import {
  EMBED_TWEET_FETCHED,
  embedTweetFetched,
  error,
  INSERT_TWEET,
  TWEET_INSERTED,
  tweetInserted,
} from '../../Redux/State/TextEditor/InsertTweet'
import {
  from,
  of,
} from 'rxjs'
import {
  getTweetIdFromUrl,
} from '../../Parser/HtmlToComponents'
import {
  insertNewNodeAtIndex,
} from './TextEditor'
import {
  logObservableError,
} from '../../Util'
import {
  OPEN as OPEN_MEDIAPICKER,
} from '../../Redux/State/MediaPicker/MediaPicker'
import {
  renderToString,
} from 'react-dom/server'
import {
  renderTweet,
} from '../../Redux/State/Tweet'
import {
  UnconnectedTweet,
} from '../../Component/View/TextEditor/Widget'
import uniqid from 'uniqid'

/**
 * Inserts an embed of tweet in the edited DOM. The embed code to insert is
 * fetched from the tweet URL.
 *
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/overview
 */
export const fetchEmbedTweetEpic = (action$, state$, { fetchApi }) => action$.pipe(
  ofType(INSERT_TWEET),
  mergeMap(action => from(fetchApi(
    `${process.env.REACT_APP_MOCK_SERVER_API_URL}/twitter?url=${action.url}`,
  )).pipe(
    map(response => embedTweetFetched(
      action.editorName,
      response.html,
      action.url,
    )),
    catchError(() => of(error(action.editorName))),
  )),
)

// insertTweetEpic :: Epic -> Observable Action.TWEET_INSERTED Action.ERROR
export const insertTweetEpic = (action$, state$) => action$.pipe(
  ofType(EMBED_TWEET_FETCHED),
  withLatestFrom(state$),
  mergeMap(([ action, state ]) => from(
    insertTweetNode(action, state.TextEditor),
  ).pipe(
    map(apply(tweetInserted)),
    catchError(() => of(error(action.editorName))),
  )),
)

// renderInsertedTweetEpic :: Observable Action Error -> Observable Action _
export const renderInsertedTweetEpic = action$ => action$.pipe(
  ofType(TWEET_INSERTED),
  map(({ tweetId, uid, originalHtmlMarkup }) => renderTweet(tweetId, uid, originalHtmlMarkup)),
  logObservableError(),
)

// insertTweetNode :: (Object, State.TextEditor) -> Promise
const insertTweetNode = ({ editorName, url, html }, textEditor) => new Promise(resolve => {
  const tweetId = getTweetIdFromUrl(url);
  const uid = uniqid(tweetId);

  const newNode = pipe(
    tap(e => e.innerHTML = renderToString(UnconnectedTweet(tweetId, uid), 'text/html')),
    prop('firstChild'),
  )(document.createElement('div'));

  insertNewNodeAtIndex(
    newNode,
    textEditor.ParagraphToolbox[editorName].targetNodeIndex,
    editorName,
  );

  const originalHtmlMarkup = pipe(
    tap(e => e.innerHTML = html),
    // only grab the `blockquote` tag, not the `script` tag
    e => e.firstChild.outerHTML,
  )(document.createElement('div'));

  resolve([ editorName, tweetId, uid, originalHtmlMarkup ]);
})

// closeInsertTweetEpic :: Observable Action Error -> Observable Action _
const closeInsertTweetEpic = action$ => action$.pipe(
  ofType(
    TWEET_INSERTED,
    OPEN_INSERT_YOUTUBE_VIDEO,
    OPEN_MEDIAPICKER,
  ),
  map(ifElse(
    compose(equals(OPEN_MEDIAPICKER), prop('type')),
    path(['extra', 'editorName']),
    prop('editorName'),
  )),
  map(closeInsertTweet),
)

export default combineEpics(
  fetchEmbedTweetEpic,
  insertTweetEpic,
  closeInsertTweetEpic,
  renderInsertedTweetEpic,
)
