import { ActionsObservable, StateObservable } from 'redux-observable'
import { Subject } from 'rxjs'
import { TestScheduler } from 'rxjs/testing'
import {
  saveRangeEpic,
  createLinkEpic,
  refreshTextToolboxStateEpic,
  pickImageEpic,
  insertImageEpic,
  pickVideoEpic,
  insertVideoEpic,
} from './TextEditor'
import {
  insertImage,
  imageInserted,
  videoInserted,
  insertVideo,
  IMAGE_INSERTED,
  INSERT_IMAGE,
  INSERT_VIDEO,
  VIDEO_INSERTED,
} from '../../Redux/State/TextEditor/ParagraphToolbox'
import {
  show as showTextToolbox,
  mutate,
  openLinkCreator,
  REFRESH_BUTTONS_STATE,
  CLOSE_LINK_CREATOR,
  SAVE_RANGE,
} from '../../Redux/State/TextEditor/TextToolbox'
import { pickImageWithCredits } from '../../Redux/State/MediaPicker/ImagePicker'
import { pickVideo } from '../../Redux/State/MediaPicker/VideoPicker'

const containerMock = {
  parentNode: {
    closest: jest.fn(),
  },
};
const rangeMock = {
  startContainer: containerMock,
  endContainer: containerMock,
  cloneRange: jest.fn(),
};
const selectionMock = {
  getRangeAt: jest.fn().mockReturnValue(rangeMock),
  removeAllRanges: jest.fn(),
  addRange: jest.fn(),
  type: 'Range',
};
const dependencies = {
  window: {
    getSelection: jest.fn().mockReturnValue(selectionMock)
  }
};

beforeEach(() => {
  document.body.innerHTML = `
    <div class="edited-text-root" data-editor-name="editor-name">
      <h1>This is a title</h1>
      <p>This is a little pargraph</p>
    </div>
  `;
  document.queryCommandState = jest.fn();
  document.execCommand = jest.fn();
});

describe('Epic :: TextEditor :: TextEditor :: saveRangeEpic', () => {
  const openLinkCreator$ = ActionsObservable.of(openLinkCreator('editor-name'));
  const state$ = new StateObservable(new Subject(), {});

  it('dispatches saveRange', done => {
    saveRangeEpic(openLinkCreator$, state$, dependencies)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(SAVE_RANGE)

        done()
      })
      .catch(err => { fail(err); done() });
  }, 1000);
});

describe('Epic :: TextEditor :: TextEditor :: createLinkEpic', () => {
  const state$ = new StateObservable(new Subject, {
    TextEditor: {
      TextToolbox: {
        'editor-name': { range: rangeMock }
      },
    },
  });

it('dispatches closeLinkCreator', done => {
    const mutate$ = ActionsObservable.of(mutate('editor-name')('LINK', { href: ''}));

    createLinkEpic(mutate$, state$, dependencies)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(CLOSE_LINK_CREATOR)

        done()
      })
      .catch(err => { fail(err); done() });
  }, 1000);

  it('reject others mutations', done => {
    const rejectMutate$ = ActionsObservable.of(mutate('editorName')('BOLD'));

    createLinkEpic(rejectMutate$, state$, dependencies)
      .toPromise(Promise)
      .then(result => {
        expect(result).toEqual(undefined)

        done()
      })
      .catch(err => { fail(err); done() });
  }, 1000);
});

describe('Epic :: TextEditor :: TextEditor :: refreshTextToolboxStateEpic', () => {
  it('dispatches refreshButtonsState', done => {
    const showTextToolbox$ = ActionsObservable.of(showTextToolbox('editor-name', 10));
    const mutate$ = ActionsObservable.of(mutate('editor-name')('LINK'));

    Promise.all([
      refreshTextToolboxStateEpic(showTextToolbox$, null, dependencies)
        .toPromise(Promise),
      refreshTextToolboxStateEpic(mutate$, null, dependencies)
        .toPromise(Promise),
    ])
    .then(([a1, a2]) => {
      expect(a1.type).toEqual(REFRESH_BUTTONS_STATE)
      expect(a2.type).toEqual(REFRESH_BUTTONS_STATE)

      done()
    })
    .catch(err => { fail(err); done() });
  }, 1000);
});

describe('Epic :: TextEditor :: TextEditor :: pickImageEpic', () => {
  it('dispatches insertImage', done => {
    const pickImageWithCredits$ = ActionsObservable.of(
      pickImageWithCredits(1, 'TEXT_EDITOR', { editorName: 'editor-name'})
    );
    const state$ = new StateObservable(new Subject(), {
      MediaPicker: {
        ImagePicker: {
          images: [{id: 1}],
        },
      },
    });

    pickImageEpic(pickImageWithCredits$, state$)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(INSERT_IMAGE)

        done()
      })
      .catch(err => { fail(err); done() });
  }, 1000);
});

describe('Epic :: TextEditor :: TextEditor :: insertImageEpic', () => {
  it('dispatches imageInserted', done => {
    const imageMock = { href: 'http://imagelibmock.org/test.png', legend: 'merkel'};
    const insertImage$ = ActionsObservable.of(insertImage('editor-name', imageMock));
    const state$ = new StateObservable(new Subject, {
      TextEditor: {
        ParagraphToolbox: {
          'editor-name': {
            targetNodeIndex: 2
          },
        },
      },
    });

    insertImageEpic(insertImage$, state$)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(IMAGE_INSERTED)

        done()
      })
      .catch(err => { fail(err); done() });
  }, 1000);
});

describe('Epic :: TextEditor :: TextEditor :: pickVideoEpic', () => {
  it('dispatches insertVideo', done => {
    const pickVideo$ = ActionsObservable.of(
      pickVideo("slkdhlskdg", 'TEXT_EDITOR', { editorName: 'editor-name' })
    );
    const state$ = new StateObservable(new Subject(), {
      MediaPicker: {
        VideoPicker: {
          videos: [
            { id: "slkdhlskdg", name: "test"},
          ],
        },
      },
    });

    pickVideoEpic(pickVideo$, state$)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(INSERT_VIDEO)

        done()
      })
      .catch(err => { fail(err); done() });
  }, 1000);
});

describe('Epic :: TextEditor :: TextEditor :: insertVideoEpic', () => {
  it('dispatches videoInserted', done => {
    const videoMock = { id: "9329875", name: "test" };
    const insertVideo$ = ActionsObservable.of(insertVideo('editor-name', videoMock));
    const state$ = new StateObservable(new Subject(), {
      Router: { params: { locale: 'en' }, },
      TextEditor: {
        ParagraphToolbox: {
          'editor-name': {
            targetNodeIndex: 2
          },
        },
      },
    });

    insertVideoEpic(insertVideo$, state$)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(VIDEO_INSERTED)

        done()
      })
      .catch(err => { fail(err); done() });
  }, 1000);
});
