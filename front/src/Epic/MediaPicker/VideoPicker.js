import { ofType, combineEpics } from 'redux-observable'
import { merge } from 'rxjs'
import { map, withLatestFrom, mergeMap, debounceTime, filter } from 'rxjs/operators'
import { logObservableError } from '../../Util'
import {
  FETCH_VIDEOS,
  SEARCH_VIDEOS,
  SCROLL_LEFT,
  SCROLL_RIGHT,
  fetchVideos,
  videosReceived
} from '../../Redux/State/MediaPicker/VideoPicker'
import { join, prop, compose, lte, length } from 'ramda'

// fetchVideosEpic :: (Observable Action Error, Observable State Error, Object)
// -> Observable Action.VIDEOS_RECEIVED
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
  action$.pipe(ofType(SCROLL_LEFT, SCROLL_RIGHT))
).pipe(
  map(fetchVideos),
)

// search video => always page 1 + debounce
export default combineEpics(
  fetchVideosEpic,
  searchVideosEpic,
)
