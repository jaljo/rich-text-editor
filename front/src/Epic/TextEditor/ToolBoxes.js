import {
  allPass,
  apply,
  both,
  complement,
  compose,
  equals,
  ifElse,
  isNil,
  last,
  path,
  pipe,
  prop,
} from "ramda";
import {
  CLEAR,
  CLICK,
  INITIALIZE,
  SELECT_TEXT,
  TEXT_PASTED,
} from "../../Redux/State/TextEditor/TextEditor";
import {
  CLEAR as CLEAR_PARAGRAPH_TOOLBOX,
  CLOSE_INSERT_TWEET,
  CLOSE_INSERT_YOUTUBE_VIDEO,
  closeInsertTweet,
  closeInsertYoutubeVideo,
  hideAll as hideAllParagraphToolboxes,
  IMAGE_INSERTED,
  OPEN_INSERT_TWEET,
  OPEN_INSERT_YOUTUBE_VIDEO,
  show as showParagraphToolbox,
  VIDEO_INSERTED,
} from "../../Redux/State/TextEditor/ParagraphToolbox";
import {
  CLEAR as CLEAR_TEXT_TOOLBOX,
  CLOSE_LINK_CREATOR,
  closeLinkCreator,
  hideAll as hideAllTextToolboxes,
  OPEN_LINK_CREATOR,
  show as showTextToolbox,
} from "../../Redux/State/TextEditor/TextToolbox";
import {
  closestHavingClass,
  isEscapeKey,
  logObservableError,
} from "../../Util";
import {
  combineEpics,
  ofType,
} from "redux-observable";
import {
  filter,
  map,
  mergeMap,
  switchMap,
  takeUntil,
} from "rxjs/operators";
import {
  fromEvent,
  merge,
} from "rxjs";
import {
  getRootNodesAsArray,
} from "./TextEditor";
import {
  TWEET_INSERTED,
} from "../../Redux/State/TextEditor/InsertTweet";
import {
  YOUTUBE_VIDEO_INSERTED,
} from "../../Redux/State/TextEditor/InsertYoutubeVideo";


// isRange :: Selection -> Boolean
const isRange = compose(equals("Range"), prop("type"));

// isTextNode :: Node -> Boolean
const isTextNode = compose(equals(3), prop("nodeType"));

// getParagraphTopPosition :: Selection -> Number
const getParagraphTopPosition = pipe(
  prop("anchorNode"),
  ifElse(
    isTextNode,
    // nodeType === Node.TEXT_NODE
    path(["parentElement", "offsetTop"]),
    // nodeType === Node.ELEMENT_NODE
    prop("offsetTop"),
  ),
);

// isEmptyParagraph :: Selection -> Boolean
export const isEmptyParagraph = pipe(
  prop("anchorNode"),
  both(
    compose(isNil, prop("data")),
    compose(equals("P"), prop("tagName")),
  ),
);

// getNodeIndex :: (String, Node) -> Number
const getNodeIndex = (editorName, node) =>
  getRootNodesAsArray(editorName)
    .indexOf(node);

// notExcluded :: Node -> Boolean
const notExcluded = allPass([
  compose(isNil, closestHavingClass("image-wrapper")),
  compose(isNil, closestHavingClass("knp-rendered-tweet")),
]);

// showTextToolboxEpic :: Epic -> Observable Action
export const showTextToolboxEpic = (action$, _, { window }) =>
  action$.pipe(
    ofType(SELECT_TEXT),
    map(action => [ action.editorName, window.getSelection()]),
    filter(compose(isRange, last)),
    filter(compose(notExcluded, prop("anchorNode"), last)),
    map(([ editor, selection ]) => showTextToolbox(
      editor,
      getParagraphTopPosition(selection),
    )),
    logObservableError(),
  );

// hideAllTextToolboxesEpic :: Epic -> Observable Action
export const hideAllTextToolboxesEpic = (action$, _, { window }) =>
  action$.pipe(
    ofType(SELECT_TEXT),
    map(() => window.getSelection()),
    filter(complement(isRange)),
    map(hideAllTextToolboxes),
    logObservableError(),
  );

// showParagraphToolboxEpic :: Epic -> Observable Action.SHOW_PARAGRAPH_TOOLBOX
export const showParagraphToolboxEpic = (action$, _, { window }) =>
  action$.pipe(
    ofType(SELECT_TEXT),
    map(action => [ action.editorName, window.getSelection()]),
    filter(compose(isEmptyParagraph, last)),
    map(([ editor, selection]) => [
      editor,
      getParagraphTopPosition(selection),
      getNodeIndex(editor, selection.anchorNode),
    ]),
    map(apply(showParagraphToolbox)),
    logObservableError(),
  );

// showParagraphToolboxToReplaceElementEpic :: Epic -> Observable Action
const showParagraphToolboxToReplaceElementEpic = action$ => action$.pipe(
  ofType(CLICK),
  filter(compose(equals("IMG"), path(["node", "tagName"]))),
  map(action => [
    action.editorName,
    action.node.parentElement.offsetTop,
    getNodeIndex(action.editorName, action.node.parentElement),
  ]),
  map(apply(showParagraphToolbox)),
  logObservableError(),
);

// hideAllParagraphToolboxesEpic :: Epic -> Observable Action
export const hideAllParagraphToolboxesEpic = (action$, _, { window }) =>
  merge(
    action$.pipe(
      ofType(SELECT_TEXT),
      map(() => window.getSelection()),
      filter(complement(isEmptyParagraph)),
    ),
    action$.pipe(ofType(
      TWEET_INSERTED,
      IMAGE_INSERTED,
      YOUTUBE_VIDEO_INSERTED,
      VIDEO_INSERTED,
      TEXT_PASTED,
    )),
  ).pipe(
    map(hideAllParagraphToolboxes),
    logObservableError(),
  );

// hideToolboxesOnClickOusideEditorEpic :: Epic -> Observable Action
const hideToolboxesOnClickOusideEditorEpic = (action$, _, { window }) =>
  action$.pipe(
    ofType(INITIALIZE),
    switchMap(() => fromEvent(window, "mousedown").pipe(
      takeUntil(action$.pipe(ofType(CLEAR))),
    )),
    map(prop("target")),
    filter(compose(isNil, closestHavingClass("text-editor"))),
    // ensure toolboxes are not hidden when a mutation button is clicked
    filter(node => !node.classList.contains("ttbx-mutation")),
    mergeMap(() => [
      hideAllTextToolboxes(),
      hideAllParagraphToolboxes(),
    ]),
    logObservableError(),
  );

// closeInsertTweetFormEpic :: Epic -> Observable Action
const closeInsertTweetFormEpic = action$ => action$.pipe(
  ofType(OPEN_INSERT_TWEET),
  map(prop("editorName")),
  switchMap(editorName => fromEvent(window, "keydown").pipe(
    filter(isEscapeKey),
  ).pipe(
    takeUntil(action$.pipe(ofType(
      CLOSE_INSERT_TWEET,
      CLEAR_PARAGRAPH_TOOLBOX),
    )),
    map(() => closeInsertTweet(editorName)),
  )),
);

// closeInsertYoutubeFormEpic :: Epic -> Observable Action
const closeInsertYoutubeFormEpic = action$ => action$.pipe(
  ofType(OPEN_INSERT_YOUTUBE_VIDEO),
  map(prop("editorName")),
  switchMap(editorName => fromEvent(window, "keydown").pipe(
    filter(isEscapeKey),
  ).pipe(
    takeUntil(action$.pipe(ofType(
      CLOSE_INSERT_YOUTUBE_VIDEO,
      CLEAR_PARAGRAPH_TOOLBOX,
    ))),
    map(() => closeInsertYoutubeVideo(editorName)),
  )),
);

// closeLinkCreatorFormEpic :: Epic -> Observable Action
const closeLinkCreatorFormEpic = action$ => action$.pipe(
  ofType(OPEN_LINK_CREATOR),
  map(prop("editorName")),
  switchMap(editorName => fromEvent(window, "keydown").pipe(
    filter(isEscapeKey),
  ).pipe(
    takeUntil(action$.pipe(ofType(
      CLOSE_LINK_CREATOR,
      CLEAR_TEXT_TOOLBOX,
    ))),
    map(() => closeLinkCreator(editorName)),
  )),
);

export default combineEpics(
  closeInsertTweetFormEpic,
  closeInsertYoutubeFormEpic,
  closeLinkCreatorFormEpic,
  hideAllParagraphToolboxesEpic,
  hideAllTextToolboxesEpic,
  hideToolboxesOnClickOusideEditorEpic,
  showParagraphToolboxEpic,
  showParagraphToolboxToReplaceElementEpic,
  showTextToolboxEpic,
);
