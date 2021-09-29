import {
  combineEpics,
  ofType,
} from 'redux-observable'
import {
  compose,
  join,
  length,
  lte,
  prop,
} from 'ramda'
import {
  debounceTime,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators'
import {
  FETCH_VIDEOS,
  fetchVideos,
  SCROLL_LEFT,
  SCROLL_RIGHT,
  SEARCH_VIDEOS,
  videosReceived,
} from '../../Redux/State/MediaPicker/VideoPicker'
import {
  logObservableError,
} from '../../Util'
import {
  merge,
} from 'rxjs'

// fetchVideosEpic :: Epic -> Observable Action
export const fetchVideosEpic = (action$, state$, { fetchApi }) =>
  action$.pipe(
    ofType(FETCH_VIDEOS),
    withLatestFrom(state$),
    mergeMap(([ _, state ]) => fetchApi(join('', [
      `${process.env.REACT_APP_MOCK_SERVER_API_URL}/videos`,
      `?q=${state.MediaPicker.VideoPicker.searchString}`,
      `&page=${state.MediaPicker.VideoPicker.page}`,
      `&limit=10`,
    ]), {
      method: 'GET',
    })),
    map(videosReceived),
    logObservableError(),
  )

// searchVideosEpic :: Observable Action Error -> Observable Action.FETCH_VIDEOS
export const searchVideosEpic = action$ => merge(
  action$.pipe(
    ofType(SEARCH_VIDEOS),
    filter(compose(lte(3), length, prop('searchString'))),
    debounceTime(250),
  ),
  action$.pipe(ofType(SCROLL_LEFT, SCROLL_RIGHT)),
).pipe(
  map(fetchVideos),
)

// search video => always page 1 + debounce
export default combineEpics(
  fetchVideosEpic,
  searchVideosEpic,
)
