import { ofType, combineEpics } from 'redux-observable'
import { logObservableError } from '../../Util'
import { map, withLatestFrom, mergeMap, catchError } from 'rxjs/operators'
import { compose, prop, pipe, equals, ifElse, path } from 'ramda'
import { insertNewNodeAtIndex } from './TextEditor'
import { from, of } from 'rxjs'
import {
  INSERT_YOUTUBE_VIDEO,
  YOUTUBE_VIDEO_INSERTED,
  youtubeVideoInserted,
  error,
} from '../../Redux/State/TextEditor/InsertYoutubeVideo'
import {
  closeInsertYoutubeVideo,
  OPEN_INSERT_TWEET,
} from '../../Redux/State/TextEditor/ParagraphToolbox'
import { OPEN as OPEN_MEDIAPICKER } from '../../Redux/State/MediaPicker/MediaPicker'

// insertYoutubeVideoEpic :: Observable Action Error -> Observable Action _
export const insertYoutubeVideoEpic = (action$, state$) => action$.pipe(
  ofType(INSERT_YOUTUBE_VIDEO),
  withLatestFrom(state$),
  mergeMap(([ action, state ]) => from(
    validateYoutubeUrl(action.url)
      .then(url => createYoutubeIframe(url))
      .then(iframe => insertNewNodeAtIndex(
        iframe,
        state.TextEditor.ParagraphToolbox[action.editorName].targetNodeIndex,
        action.editorName,
      )),
  ).pipe(
    map(() => youtubeVideoInserted(action.editorName)),
    catchError(() => of(error(action.editorName))),
  )),
  logObservableError(),
)

// closeInsertYoutubeVideoEpic :: Observable Action Error -> Observable Action _
export const closeInsertYoutubeVideoEpic = action$ => action$.pipe(
  ofType(
    YOUTUBE_VIDEO_INSERTED,
    OPEN_INSERT_TWEET,
    OPEN_MEDIAPICKER,
  ),
  map(ifElse(
    compose(equals(OPEN_MEDIAPICKER), prop('type')),
    path(['extra', 'editorName']),
    prop('editorName'),
  )),
  map(closeInsertYoutubeVideo),
  logObservableError(),
)

// validateYoutubeUrl :: String -> Promise String String
export const validateYoutubeUrl = pipe(
  url => url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/),
  // matches[2] = youtube video identifier
  matches => new Promise((resolve, reject) => matches && matches[2].length === 11
    ? resolve(`https://www.youtube.com/embed/${matches[2]}`)
    : reject('The provided URL is not a valid youtube video.'),
  ),
);

// createYoutubeIframe :: String -> Node.IFRAME
const createYoutubeIframe = url => {
  const iframe = document.createElement('iframe');
  iframe.classList.add('youtube-embed');
  iframe.setAttribute('src', url);
  iframe.setAttribute('allowfullscreen', true);
  iframe.setAttribute('contentEditable', false);

  return iframe;
};

export default combineEpics(
  insertYoutubeVideoEpic,
  closeInsertYoutubeVideoEpic,
)
