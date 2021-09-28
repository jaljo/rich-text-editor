import { StateObservable } from 'redux-observable'
import { Subject, of } from 'rxjs'
import {
  showTextToolboxEpic,
  hideAllTextToolboxesEpic,
  showParagraphToolboxEpic,
  hideAllParagraphToolboxesEpic,
} from './ToolBoxes'
import {
  imageInserted,
  videoInserted,
  SHOW as SHOW_PARAGRAPH_TOOLBOX,
  HIDE_ALL as HIDE_PARAGRAPH_TOOLBOX,
} from '../../Redux/State/TextEditor/ParagraphToolbox'
import {
  SHOW as SHOW_TEXT_TOOLBOX,
  HIDE_ALL as HIDE_TEXT_TOOLBOX,
} from '../../Redux/State/TextEditor/TextToolbox'
import { selectText } from '../../Redux/State/TextEditor/TextEditor'
import { tweetInserted } from '../../Redux/State/TextEditor/InsertTweet'

const rangeMock = {
  startContainer: {},
  endContainer: {},
  cloneRange: () => null,
};
const selectionMock = {
  getRangeAt: () => rangeMock,
  type: 'Range',
  anchorNode: {
    data: 'bla bla',
    tagName: 'FIGURE',
  },
};
const dependencies = {
  window: {
    getSelection: () => selectionMock
  }
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

describe('Epic :: TextEditor :: ToolBoxes :: showTextToolboxEpic', () => {
  const selectText$ = of(selectText('editor-name'));
  const state$ = new StateObservable(new Subject(), {});

  it('dispatches showTextToolbox', done => {
    showTextToolboxEpic(selectText$, state$, dependencies)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(SHOW_TEXT_TOOLBOX)

        done()
      })
      .catch(err => { console.error(err); done() });
  }, 1000);

  it('dont dispatches showTextToolbox (empty selection)', done => {
    const dependencies = {
      window: {
        getSelection: () => ({ type: 'Char'})
      }
    };

    showTextToolboxEpic(selectText$, state$, dependencies)
      .toPromise(Promise)
      .then(result => {
        expect(result).toEqual(undefined)

        done()
      })
      .catch(err => { console.error(err); done() });
  }, 1000);
});

describe('Epic :: TextEditor :: ToolBoxes :: hideAllTextToolboxesEpic', () => {
  const selectText$ = of(selectText('editor-name'));
  const state$ = new StateObservable(new Subject(), {
    TextEditor: {
      TextToolbox: {
        'editor-name': {
          visible: true,
        },
      },
    },
  });

  it('dispatches hideTextToolbox', done => {
    const dependencies = {
      window: {
        getSelection: () => ({ type: 'Char'})
      }
    };

    hideAllTextToolboxesEpic(selectText$, state$, dependencies)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(HIDE_TEXT_TOOLBOX)

        done()
      })
      .catch(err => { console.error(err); done() });
  }, 1000);

  it('dont dispatches hideTextToolbox (not empty selection)', done => {
    hideAllTextToolboxesEpic(selectText$, state$, dependencies)
      .toPromise(Promise)
      .then(result => {
        expect(result).toEqual(undefined)

        done()
      })
      .catch(err => { console.error(err); done() });
  }, 1000);
});

describe('Epic :: TextEditor :: ToolBoxes :: showParagraphToolboxEpic', () => {
  const selectText$ = of(selectText('editor-name'));
  const state$ = new StateObservable(new Subject(), {});

  it('dispatches showParagraphToolbox', done => {
    const dependencies = {
      window: {
        getSelection: () => ({
          anchorNode: {
            data: null,
            tagName: 'P',
          },
        }),
      },
    };

    showParagraphToolboxEpic(selectText$, state$, dependencies)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(SHOW_PARAGRAPH_TOOLBOX)

        done()
      })
      .catch(err => { console.error(err); done() });
  }, 1000);

  it('does not dispatch showParagraphToolbox (not empty paragraph)', done => {
    const dependencies = {
      window: {
        getSelection: () => ({
          anchorNode: {
            data: 'bla bla',
            tagName: 'P'
          },
        }),
      },
    };

    showParagraphToolboxEpic(selectText$, state$, dependencies)
      .toPromise(Promise)
      .then(result => {
        expect(result).toEqual(undefined)

        done()
      })
      .catch(err => { console.error(err); done() });
  }, 1000);

  it('does not dispatch showParagraphToolbox (not in a paragraph)', done => {
    const dependencies = {
      window: {
        getSelection: () => ({
          anchorNode: {
            data: null,
            tagName: 'FIGURE'
          },
        }),
      },
    };

    showParagraphToolboxEpic(selectText$, state$, dependencies)
      .toPromise(Promise)
      .then(result => {
        expect(result).toEqual(undefined)

        done()
      })
      .catch(err => { console.error(err); done() });
  }, 1000);
});

describe('Epic :: TextEditor :: ToolBoxes :: hideAllParagraphToolboxesEpic', () => {
  const state$ = new StateObservable(new Subject(), {});
  const selectText$ = of(selectText('editor-name'));

  it('dispatches hideParagraphToolbox', done => {
    const tweetInserted$ = of(tweetInserted('editor-name'));
    const imageInseretd$ = of(imageInserted('editor-name'));
    const videoInserted$ = of(videoInserted('editor-name'))
    const dependencies = {
      window: {
        getSelection: () => ({
          anchorNode: {
            data: 'this selection is not empty !',
            tagName: 'P',
          }
        }),
      },
    };

    Promise.all([
      hideAllParagraphToolboxesEpic(selectText$, state$, dependencies)
        .toPromise(Promise),
      hideAllParagraphToolboxesEpic(tweetInserted$, state$, dependencies)
        .toPromise(Promise),
      hideAllParagraphToolboxesEpic(imageInseretd$, state$, dependencies)
        .toPromise(Promise),
      hideAllParagraphToolboxesEpic(videoInserted$, state$, dependencies)
        .toPromise(Promise),
    ])
    .then(([a1, a2, a3, a4]) => {
      expect(a1.type).toEqual(HIDE_PARAGRAPH_TOOLBOX)
      expect(a2.type).toEqual(HIDE_PARAGRAPH_TOOLBOX)
      expect(a3.type).toEqual(HIDE_PARAGRAPH_TOOLBOX)
      expect(a4.type).toEqual(HIDE_PARAGRAPH_TOOLBOX)

      done()
    })
    .catch(err => { console.error(err); done() });
  }, 1000);

  it('does not dispatch hideParagraphToolbox (empty paragraph)', done => {
    const dependencies = {
      window: {
        getSelection: () => ({
          anchorNode: {
            data: null,
            tagName: 'P',
          }
        }),
      },
    };

    hideAllParagraphToolboxesEpic(selectText$, state$, dependencies)
      .toPromise(Promise)
      .then(result => {
        expect(result).toEqual(undefined)

        done()
      })
      .catch(err => { console.error(err); done() });
  }, 1000);
});
