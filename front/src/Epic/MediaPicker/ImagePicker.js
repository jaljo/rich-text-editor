import { map, mergeMap, debounceTime, withLatestFrom } from 'rxjs/operators'
import { combineEpics, ofType } from 'redux-observable'
import { logObservableError, findById } from '../../Util'
import { isEmpty, join, prop, ifElse, pipe, map as fmap } from 'ramda'
import {
  FETCH_IMAGES,
  SCROLL_LEFT,
  SCROLL_RIGHT,
  PICK_IMAGE,
  receivedImages,
  pickImageWithCredits,
  error,
} from '../../Redux/State/MediaPicker/ImagePicker'

// formatImage :: PexelsImage -> Image
const formatImage = image => ({
  credit: image.photographer,
  href: image.src.medium,
  id: image.id,
  legend: image.photographer_url,
})

// fetchImages :: (Fetch, String, String) -> Promise
const fetchImages = (fetchApi, page, searchString) =>
  fetchApi(join('', [
    `https://api.pexels.com/v1/search`,
    // pexels doesn't support empty query parameters or no query parameters
    `?query=${searchString === '' ? 'estonia' : searchString}`,
    `&per_page=10`,
    `&page=${page}`,
  ]), {
    headers: {
      'Authorization': process.env.REACT_APP_IMAGE_API_KEY,
    },
    method: 'GET',
  })

// searchImagesEpic :: (Observable Action Error, Observable State Error, Object) -> Observable Action _
export const searchImagesEpic = (action$, _, { fetchApi }) =>
  action$.pipe(
    ofType(FETCH_IMAGES),
    debounceTime(250),
    mergeMap(({ searchString }) => fetchImages(
      fetchApi,
      1,
      searchString,
    )),
    map(pipe(
      prop('photos'),
      fmap(formatImage),
      receivedImages,
    )),
    logObservableError(),
  )

// changePageEpic :: (Observable Action Error, Observable State Error, Object) -> Observable Action _
export const changePageEpic = (action$, state$, { fetchApi }) =>
  action$.pipe(
    ofType(SCROLL_RIGHT, SCROLL_LEFT),
    withLatestFrom(state$),
    mergeMap(([ _, state ]) => fetchImages(
      fetchApi,
      state.MediaPicker.ImagePicker.page,
      state.MediaPicker.ImagePicker.searchString,
    )),
    map(pipe(
      prop('photos'),
      fmap(formatImage),
      receivedImages,
    )),
    logObservableError(),
  )

// ensurePickedImageHasCreditsEpic :: Epic -> Observable Action ERROR
export const ensurePickedImageHasCreditsEpic = (action$, state$) =>
  action$.pipe(
    ofType(PICK_IMAGE),
    withLatestFrom(state$),
    map(([ action, state ]) => [
      action,
      findById(action.imageId, state.MediaPicker.ImagePicker.images),
    ]),
    map(([ action, image ]) => ifElse(
      image => !isEmpty(image.credit),
      () => pickImageWithCredits(action.imageId, action.domain, action.extra),
      () => error('This image has no credits. Please fill credits before using it.'),
    )(image)),
    logObservableError(),
  )

export default combineEpics(
  searchImagesEpic,
  changePageEpic,
  ensurePickedImageHasCreditsEpic,
)
