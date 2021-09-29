import {
  CLOSE_LINK_CREATOR,
  mutate,
  openLinkCreator,
  REFRESH_BUTTONS_STATE,
  SAVE_RANGE,
  show as showTextToolbox,
} from "../../Redux/State/TextEditor/TextToolbox";
import {
  createLinkEpic,
  insertImageEpic,
  insertVideoEpic,
  pickImageEpic,
  pickVideoEpic,
  refreshTextToolboxStateEpic,
  saveRangeEpic,
} from "./TextEditor";
import {
  IMAGE_INSERTED,
  INSERT_IMAGE,
  INSERT_VIDEO,
  insertImage,
  insertVideo,
  VIDEO_INSERTED,
} from "../../Redux/State/TextEditor/ParagraphToolbox";
import {
  of,
  Subject,
} from "rxjs";
import {
  pickImageWithCredits,
} from "../../Redux/State/MediaPicker/ImagePicker";
import {
  pickVideo,
} from "../../Redux/State/MediaPicker/VideoPicker";
import {
  StateObservable,
} from "redux-observable";

const containerMock = {
  parentNode: {
    closest: () => null,
  },
};
const rangeMock = {
  cloneRange: () => null,
  endContainer: containerMock,
  startContainer: containerMock,
};
const selectionMock = {
  addRange: () => null,
  getRangeAt: () => rangeMock,
  removeAllRanges: () => null,
  type: "Range",
};
const dependencies = {
  window: {
    getSelection: () => selectionMock,
  },
};

beforeEach(() => {
  document.body.innerHTML = `
    <div class="edited-text-root" data-editor-name="editor-name">
      <h1>This is a title</h1>
      <p>This is a little pargraph</p>
    </div>
  `;
  document.queryCommandState = () => null;
  document.execCommand = () => null;
});

describe("Epic :: TextEditor :: TextEditor :: saveRangeEpic", () => {
  const openLinkCreator$ = of(openLinkCreator("editor-name"));
  const state$ = new StateObservable(new Subject(), {});

  it("dispatches saveRange", async () => {
    const action = await saveRangeEpic(openLinkCreator$, state$, dependencies)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(SAVE_RANGE);
  }, 1000);
});

describe("Epic :: TextEditor :: TextEditor :: createLinkEpic", () => {
  const state$ = new StateObservable(new Subject, {
    TextEditor: {
      TextToolbox: {
        "editor-name": { range: rangeMock },
      },
    },
  });

  it("dispatches closeLinkCreator", async () => {
    const mutate$ = of(mutate("editor-name")("LINK", { href: "" }));

    const action = await createLinkEpic(mutate$, state$, dependencies)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(CLOSE_LINK_CREATOR);
  }, 1000);

  it("reject others mutations", async () => {
    const rejectMutate$ = of(mutate("editorName")("BOLD"));

    const action = await createLinkEpic(rejectMutate$, state$, dependencies)
      .toPromise(Promise)
    ;

    expect(action).toEqual(undefined);
  }, 1000);
});

describe("Epic :: TextEditor :: TextEditor :: refreshTextToolboxStateEpic", () => {
  it("dispatches refreshButtonsState", async () => {
    const showTextToolbox$ = of(showTextToolbox("editor-name", 10));
    const mutate$ = of(mutate("editor-name")("LINK"));

    const [a1, a2] = await Promise.all([
      refreshTextToolboxStateEpic(showTextToolbox$, null, dependencies)
        .toPromise(Promise),
      refreshTextToolboxStateEpic(mutate$, null, dependencies)
        .toPromise(Promise),
    ]);

    expect(a1.type).toEqual(REFRESH_BUTTONS_STATE);
    expect(a2.type).toEqual(REFRESH_BUTTONS_STATE);
  }, 1000);
});

describe("Epic :: TextEditor :: TextEditor :: pickImageEpic", () => {
  it("dispatches insertImage", async () => {
    const pickImageWithCredits$ = of(
      pickImageWithCredits(1, "TEXT_EDITOR", { editorName: "editor-name" })
    );
    const state$ = new StateObservable(new Subject(), {
      MediaPicker: {
        ImagePicker: {
          images: [{ id: 1 }],
        },
      },
    });

    const action = await pickImageEpic(pickImageWithCredits$, state$)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(INSERT_IMAGE);
  }, 1000);
});

describe("Epic :: TextEditor :: TextEditor :: insertImageEpic", () => {
  it("dispatches imageInserted", async () => {
    const imageMock = { href: "http://imagelibmock.org/test.png", legend: "merkel" };
    const insertImage$ = of(insertImage("editor-name", imageMock));
    const state$ = new StateObservable(new Subject, {
      TextEditor: {
        ParagraphToolbox: {
          "editor-name": {
            targetNodeIndex: 2,
          },
        },
      },
    });

    const action = await insertImageEpic(insertImage$, state$)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(IMAGE_INSERTED);
  }, 1000);
});

describe("Epic :: TextEditor :: TextEditor :: pickVideoEpic", () => {
  it("dispatches insertVideo", async () => {
    const pickVideo$ = of(
      pickVideo("slkdhlskdg", "TEXT_EDITOR", { editorName: "editor-name" })
    );

    const state$ = new StateObservable(new Subject(), {
      MediaPicker: {
        VideoPicker: {
          videos: [
            { id: "slkdhlskdg", name: "test" },
          ],
        },
      },
    });

    const action = await pickVideoEpic(pickVideo$, state$)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(INSERT_VIDEO);
  }, 1000);
});

describe("Epic :: TextEditor :: TextEditor :: insertVideoEpic", () => {
  it("dispatches videoInserted", async () => {
    const videoMock = { id: "9329875", name: "test" };
    const insertVideo$ = of(insertVideo("editor-name", videoMock));
    const state$ = new StateObservable(new Subject(), {
      TextEditor: {
        ParagraphToolbox: {
          "editor-name": {
            targetNodeIndex: 2,
          },
        },
      },
    });

    const action = await insertVideoEpic(insertVideo$, state$)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(VIDEO_INSERTED);
  }, 1000);
});
