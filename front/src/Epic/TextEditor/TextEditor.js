import {
  allPass,
  apply,
  complement,
  compose,
  cond,
  equals,
  isNil,
  nth,
  pipe,
  prop,
} from "ramda";
import {
  CLOSE_LINK_CREATOR,
  closeLinkCreator,
  MUTATE,
  OPEN_LINK_CREATOR,
  refreshButtonsState,
  saveRange,
  SHOW as SHOW_TEXT_TOOLBOX,
} from "../../Redux/State/TextEditor/TextToolbox";
import {
  combineEpics,
  ofType,
} from "redux-observable";
import {
  Image as createImage,
  UnconnectedVideo,
} from "../../Component/View/TextEditor/Widget";
import {
  filter,
  ignoreElements,
  map,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import {
  findById,
  getEditor,
  logObservableError,
} from "../../Util";
import {
  imageInserted,
  INSERT_IMAGE,
  INSERT_VIDEO,
  insertImage,
  insertVideo,
  VIDEO_INSERTED,
  videoInserted,
} from "../../Redux/State/TextEditor/ParagraphToolbox";
import {
  brightcovePlayerIds,
} from "../../Const";
import {
  KEY_DOWN,
} from "../../Redux/State/TextEditor/TextEditor";
import {
  PICK_IMAGE_WITH_CREDITS,
} from "../../Redux/State/MediaPicker/ImagePicker";
import {
  PICK_VIDEO,
} from "../../Redux/State/MediaPicker/VideoPicker";
import {
  renderToString,
} from "react-dom/server";
import {
  TWEET_INSERTED,
} from "../../Redux/State/TextEditor/InsertTweet";
import {
  YOUTUBE_VIDEO_INSERTED,
} from "../../Redux/State/TextEditor/InsertYoutubeVideo";

// getRootNodesAsArray :: String -> [Node]
export const getRootNodesAsArray = editorName => Array.from(
  getEditor(editorName).childNodes,
);

// insertNewNodeAtIndex :: (Element, Number, String) -> _
export const insertNewNodeAtIndex = (newNode, targetIndex, editorName) =>
  getEditor(editorName).replaceChild(
    newNode,
    nth(targetIndex, getRootNodesAsArray(editorName)),
  );

// insertAfter :: (Node, Node) -> _
const insertAfter = (el, referenceNode) =>
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);

// createImageNode :: (Image, Number, String) -> _
const createImageNode = (image, targetIndex, editorName) => {
  const props = {
    component: {
      alt: image.credit,
      src: image.href,
      title: image.legend,
    },
  };

  // render image component using react, then convert it to a valid DOM Node
  const newNode = (new DOMParser())
    .parseFromString(renderToString(createImage(props)), "text/html")
    .querySelector("figure")
  ;

  // insert that Node at the specified position
  insertNewNodeAtIndex(newNode, targetIndex, editorName);
};

// createVideoNode :: (Video, Number, String, String) -> _
const createVideoNode = (video, targetIndex, editorName, playerId) => {
  const brightCoveVideo = renderToString(UnconnectedVideo(
    video,
    playerId,
    process.env.REACT_APP_BRIGHTCOVE_ACCOUNT_ID,
  ));

  const newNode = (new DOMParser())
    .parseFromString(brightCoveVideo, "text/html")
    .querySelector(".video-wrapper")
  ;

  insertNewNodeAtIndex(newNode, targetIndex, editorName);
};

// createAndFocusEmptyParagraph :: Node -> _
const createAndFocusEmptyParagraph = previousNode => {
  const newParagraph = document.createElement("p");
  insertAfter(newParagraph, previousNode);

  const range = document.createRange();
  range.setStart(newParagraph, 0);
  recoverSelection(window)(range);
};

// insertNewParagraphEpic :: Epic -> _
const insertNewParagraphEpic = (action$, _, { window }) =>
  action$.pipe(
    ofType(KEY_DOWN),
    filter(compose(equals(13), prop("keyCode"))),
    tap(() => {
      const editedNode = window.getSelection().anchorNode;

      if (
        // edition of an empty paragraph
        editedNode.tagName === "P"
        // edition of a paragraph containing a TextNode
        || editedNode.parentNode.tagName === "P"
      ) {
        document.execCommand("insertParagraph");
        document.execCommand("formatBlock", false, "p");
      } else {
        const previousNode = editedNode.parentNode.tagName === "FIGCAPTION"
          // edition of the FIGCAPTION of an inserted image
          ? editedNode.parentNode.parentElement
          // edition of a BLOCKQUOTE or H2 element
          : editedNode.parentNode
        ;

        createAndFocusEmptyParagraph(previousNode);
      }
    }),
    ignoreElements(),
  );

// insertParagraphAfterInsertedMediaEpic :: Epic -> _
const insertParagraphAfterInsertedMediaEpic = (action$, state$) => action$.pipe(
  ofType(YOUTUBE_VIDEO_INSERTED, TWEET_INSERTED, VIDEO_INSERTED),
  withLatestFrom(state$),
  // get lastly inserted element
  map(([ action, state ]) => nth(
    state.TextEditor.ParagraphToolbox[action.editorName].targetNodeIndex,
    getRootNodesAsArray(action.editorName),
  )),
  // create and focus a new paragraph after that node
  tap(createAndFocusEmptyParagraph),
  ignoreElements(),
  logObservableError(),
);

// saveRangeEpic :: Epic -> Observable Action
export const saveRangeEpic = (action$, _, { window }) =>
  action$.pipe(
    ofType(OPEN_LINK_CREATOR),
    map(action => [
      action.editorName,
      window.getSelection().getRangeAt(0).cloneRange(),
    ]),
    map(apply(saveRange)),
    logObservableError(),
  );

// createLinkEpic :: Epic -> Observable Action
export const createLinkEpic = (action$, state$, { window }) =>
  action$.pipe(
    ofType(MUTATE),
    filter(compose(equals("LINK"), prop("mutation"))),
    withLatestFrom(state$),
    // we first need to recover selction here for the mutation to apply
    map(([ action, state ]) => [
      action,
      state.TextEditor.TextToolbox[action.editorName].range,
    ]),
    tap(([ _, range ]) => recoverSelection(window)(range)),
    // then we can apply the mutation
    tap(([ action ]) => document.execCommand(
      "createLink",
      false,
      action.options.href,
    )),
    map(([ action ]) => closeLinkCreator(action.editorName)),
    logObservableError(),
  );

// recoverSelection :: Window -> Range -> _
const recoverSelection = window => range => {
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
};

// closeLinkCreatorEpic :: Epic -> _
const closeLinkCreatorEpic = (action$, state$, { window }) => action$.pipe(
  ofType(CLOSE_LINK_CREATOR),
  withLatestFrom(state$),
  map(([ act, state ]) => state.TextEditor.TextToolbox[act.editorName].range),
  tap(recoverSelection(window)),
  ignoreElements(),
  logObservableError(),
);

// mutationEpic :: Epic -> Observable Action
const mutationEpic = action$ =>
  action$.pipe(
    ofType(MUTATE),
    map(prop("mutation")),
    filter(complement(equals("LINK"))),
    tap(cond([
      [equals("TITLE"), () => document.execCommand("formatBlock", false, "h2")],
      [equals("PARAGRAPH"), () => document.execCommand("formatBlock", false, "p")],
      [equals("ITALIC"), () => document.execCommand("italic")],
      [equals("BOLD"), () => document.execCommand("bold")],
      [equals("UNDERLINE"), () => document.execCommand("underline")],
      /**
       * @wontfix in Firefox, <blockquote> is the exception — it will wrap any
       * containing block element
       *
       * @see formatBlock at
       * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
       *
       * Although this can be easily fixed using another block tag (i.e. PRE),
       * we decided it will introduce too much legacy in the persisted data, as
       * we should then have to parse both BC BLOCKQUOTE and PRE tags as quotes.
       */
      [equals("QUOTE"), () => document.execCommand("formatblock", false, "blockquote")],
      [equals("UNLINK"), () => document.execCommand("unlink")],
    ])),
    ignoreElements(),
  );

// refreshTextToolboxStateEpic :: Epic -> Observable Action
export const refreshTextToolboxStateEpic = (action$, _, { window }) =>
  action$.pipe(
    ofType(SHOW_TEXT_TOOLBOX, MUTATE),
    map(action => [ action, window.getSelection().getRangeAt(0) ]),
    map(([ action, range ]) => [ action.editorName, ({
      isBold: document.queryCommandState("bold"),
      isItalic: document.queryCommandState("italic"),
      isLink: isInParent("a")(range),
      isQuote: isInParent("blockquote")(range),
      isTitle: isInParent("h2")(range),
      isUnderline: document.queryCommandState("underline"),
    })]),
    map(apply(refreshButtonsState)),
    logObservableError(),
  );

// isInParent :: String -> Range -> Boolean
const isInParent = parentTagName => pipe(
  range => [
    range.startContainer.parentNode.closest(parentTagName),
    range.endContainer.parentNode.closest(parentTagName),
  ],
  allPass([
    ([ startNode ]) => !isNil(startNode),
    ([ _, endNode ]) => !isNil(endNode),
    ([ startNode, endNode ]) => equals(startNode, endNode),
  ]),
);

// pickImageEpic :: Epic -> Observable Action
export const pickImageEpic = (action$, state$) =>
  action$.pipe(
    ofType(PICK_IMAGE_WITH_CREDITS),
    filter(compose(equals("TEXT_EDITOR"), prop("domain"))),
    withLatestFrom(state$),
    map(([ action, state ]) => ({
      action,
      id: parseInt(action.imageId, 10),
      images: state.MediaPicker.ImagePicker.images,
    })),
    map(context => ({
      action: context.action,
      image: findById(context.id, context.images),
    })),
    map(({ action, image }) => insertImage(action.extra.editorName, image)),
    logObservableError(),
  );

// insertImageEpic :: Epic -> Observable Action
export const insertImageEpic = (action$, state$) =>
  action$.pipe(
    ofType(INSERT_IMAGE),
    withLatestFrom(state$),
    tap(([ action, state ]) => createImageNode(
      action.image,
      state.TextEditor.ParagraphToolbox[action.editorName].targetNodeIndex,
      action.editorName,
    )),
    map(([ action ]) => imageInserted(action.editorName)),
    logObservableError(),
  );

// pickVideoEpic :: Epic -> Observable Action
export const pickVideoEpic = (action$, state$) =>
  action$.pipe(
    ofType(PICK_VIDEO),
    filter(compose(equals("TEXT_EDITOR"), prop("domain"))),
    withLatestFrom(state$),
    map(([ action, state ]) => ({
      action,
      video: findById(action.videoId, state.MediaPicker.VideoPicker.videos),
    })),
    map(({ action, video }) => insertVideo(action.extra.editorName, video)),
    logObservableError(),
  );

// insertVideoEpic :: Epic -> Observable Action
export const insertVideoEpic = (action$, state$) =>
  action$.pipe(
    ofType(INSERT_VIDEO),
    withLatestFrom(state$),
    tap(([ action, state]) => createVideoNode(
      action.video,
      state.TextEditor.ParagraphToolbox[action.editorName].targetNodeIndex,
      action.editorName,
      brightcovePlayerIds["en"],
    )),
    map(([ action ]) => videoInserted(action.editorName, action.video.id)),
    logObservableError(),
  );

export default combineEpics(
  closeLinkCreatorEpic,
  createLinkEpic,
  insertImageEpic,
  insertNewParagraphEpic,
  insertParagraphAfterInsertedMediaEpic,
  insertVideoEpic,
  mutationEpic,
  pickImageEpic,
  pickVideoEpic,
  refreshTextToolboxStateEpic,
  saveRangeEpic,
);
