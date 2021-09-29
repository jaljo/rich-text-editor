import {
  combineEpics,
  ofType,
} from "redux-observable";
import {
  debounceTime,
  map,
  mergeMap,
  withLatestFrom,
} from "rxjs/operators";
import {
  error,
  FETCH_IMAGES,
  PICK_IMAGE,
  pickImageWithCredits,
  receivedImages,
  SCROLL_LEFT,
  SCROLL_RIGHT,
} from "../../Redux/State/MediaPicker/ImagePicker";
import {
  findById,
  logObservableError,
} from "../../Util";
import {
  map as fmap,
  ifElse,
  isEmpty,
  join,
  pipe,
  prop,
} from "ramda";

// formatImage :: PexelsImage -> Image
const formatImage = image => ({
  credit: image.photographer,
  href: image.src.medium,
  id: image.id,
  legend: image.photographer_url,
});

// fetchImages :: (Fetch, String, String) -> Promise
const fetchImages = (fetchApi, page, searchString) =>
  fetchApi(join("", [
    "https://api.pexels.com/v1/search",
    // pexels doesn't support empty query parameters or no query parameters
    `?query=${searchString === "" ? "estonia" : searchString}`,
    "&per_page=10",
    `&page=${page}`,
  ]), {
    headers: {
      "Authorization": process.env.REACT_APP_IMAGE_API_KEY,
    },
    method: "GET",
  });

// searchImagesEpic :: Epic -> Observable Action
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
      prop("photos"),
      fmap(formatImage),
      receivedImages,
    )),
    logObservableError(),
  );

// changePageEpic :: Epic -> Observable Action
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
      prop("photos"),
      fmap(formatImage),
      receivedImages,
    )),
    logObservableError(),
  );

// ensurePickedImageHasCreditsEpic :: Epic -> Observable Action
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
      () => error("This image has no credits. Please fill credits before using it."),
    )(image)),
    logObservableError(),
  );

export default combineEpics(
  searchImagesEpic,
  changePageEpic,
  ensurePickedImageHasCreditsEpic,
);
