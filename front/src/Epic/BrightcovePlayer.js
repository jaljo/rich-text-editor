import {
  combineEpics,
  ofType,
} from "redux-observable";
import {
  complement,
  compose,
  isNil,
  join,
  pathOr,
  prop,
} from "ramda";
import {
  filter,
  map,
  mergeMap,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import {
  LOAD_PLAYER,
  playerLoaded,
  REMOVE_VIDEO,
  RENDER_VIDEO,
  videoRemoved,
  videoRendered,
} from "../Redux/State/BrightcovePlayer";
import {
  brightcovePlayerIds,
} from "../Const";
import {
  logObservableError,
} from "../Util";
import {
  VIDEO_INSERTED,
} from "../Redux/State/TextEditor/ParagraphToolbox";

// getPlayer :: String -> String
const getPlayer = locale => join("", [
  "https://players.brightcove.net/",
  `${process.env.REACT_APP_BRIGHTCOVE_ACCOUNT_ID}/`,
  `${brightcovePlayerIds[locale]}_default/`,
  "index.min.js",
]);

// loadPlayerEpic :: Observable Action Error -> Observable Action.PLAYER_LOADED
export const loadPlayerEpic = action$ => action$.pipe(
  ofType(LOAD_PLAYER),
  mergeMap(({ locale }) => new Promise(resolve => {
    const script = document.createElement("script");
    script.src = getPlayer(locale);
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(locale);

    document.body.appendChild(script);
  })),
  map(playerLoaded),
  logObservableError(),
);

// getVideoElement :: String -> Element.VIDEO
const getVideoElement = id => document.querySelector(`video[data-video-id="${id}"]`);

// renderVideoEpic :: Epic -> Observable Action
export const renderVideoEpic = (action$, state$, { window }) =>
  action$.pipe(
    ofType(RENDER_VIDEO, VIDEO_INSERTED),
    map(compose(getVideoElement, prop("id"))),
    filter(complement(isNil)),
    withLatestFrom(state$),
    filter(([ _, state ]) => state.BrightcovePlayer["enPlayerReady"]),
    // brightcove SDK is loaded from the loadPlayerEpic above
    filter(() => !isNil(window["bc"])),
    map(([ video ]) => ({
      id: pathOr(null, ["dataset", "videoId"], video),
      originalHtmlMarkup: video.outerHTML,
      video,
    })),
    tap(({ video }) => window["bc"](video)),
    map(({ id, originalHtmlMarkup }) => videoRendered(id, originalHtmlMarkup)),
    logObservableError(),
  );

// removeVideoEpic :: Epic -> Observable Action
export const removeVideoEpic = (action$, state$, { window }) =>
  action$.pipe(
    ofType(REMOVE_VIDEO),
    map(compose(getVideoElement, prop("id"))),
    filter(complement(isNil)),
    filter(() => !isNil(window["videojs"])),
    tap(video => window["videojs"](video).dispose()),
    map(videoRemoved),
    logObservableError(),
  );

export default combineEpics(
  loadPlayerEpic,
  removeVideoEpic,
  renderVideoEpic,
);
