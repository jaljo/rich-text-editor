import {
  validateYoutubeUrl,
  insertYoutubeVideoEpic,
  closeInsertYoutubeVideoEpic,
} from './InsertYoutubeVideo'
import { StateObservable } from 'redux-observable'
import { of, Subject } from 'rxjs'
import { TestScheduler } from 'rxjs/testing'
import {
  insertYoutubeVideo,
  youtubeVideoInserted,
  YOUTUBE_VIDEO_INSERTED,
  ERROR,
} from '../../Redux/State/TextEditor/InsertYoutubeVideo'
import {
  CLOSE_INSERT_YOUTUBE_VIDEO,
  openInsertTweet,
} from '../../Redux/State/TextEditor/ParagraphToolbox'
import {
  open as openMediapicker,
} from '../../Redux/State/MediaPicker/MediaPicker'

beforeEach(() => {
  document.body.innerHTML = `
    <div class="edited-text-root" data-editor-name="editor-name">
      <h1>This is a title</h1>
      <p>This is a little pargraph</p>
    </div>
  `;
});

describe('Epic :: TextEditor :: InsertYoutubeVideo', () => {
  it('validate a youtube url : success', async () => {
    const url = await validateYoutubeUrl('https://www.youtube.com/watch?v=jadxTFqyhRM');

    expect(url).toEqual(
      'https://www.youtube.com/embed/jadxTFqyhRM'
    );
  }, 1000);

  it('validate a youtube url : failure (wrong base url)', async () => {
    await expect(
      validateYoutubeUrl('https://www.youtube.com/watch?v=jadx')
    ).rejects.toBe(
      'The provided URL is not a valid youtube video.'
    );
  }, 1000);

  it('validate a youtube url : failure (wrong id)', async () => {
    await expect(
      validateYoutubeUrl('https://www.knplabs.com')
    ).rejects.toBe(
      'The provided URL is not a valid youtube video.'
    );
  }, 1000);
});

describe('Epic :: TextEditor :: InsertYoutubeVideo :: insertYoutubeVideoEpic', () => {
  const state$ = new StateObservable(new Subject(), {
    TextEditor: {
      ParagraphToolbox: {
        'editor-name': {
          targetNodeIndex: 1,
        },
      },
    },
  });

  it('dispatches youtubeVideoInserted', async () => {
    const insertYoutubeVideo$ = of(
      insertYoutubeVideo('editor-name', 'https://www.youtube.com/watch?v=O9mxrurGTqo')
    );

    const action = await insertYoutubeVideoEpic(insertYoutubeVideo$, state$)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(YOUTUBE_VIDEO_INSERTED);
  }, 1000);

  it('dispatches error', async () => {
    const insertYoutubeVideo$ = of(
      insertYoutubeVideo('editor-name', 'https://www.msn.com')
    );

    const action = await insertYoutubeVideoEpic(insertYoutubeVideo$, state$)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(ERROR);
  }, 1000);
});

describe('Epic :: TextEditor :: InsertYoutubeVideo :: closeInsertYoutubeVideoEpic', () => {
  it('disatches closeInsertYoutubeVideo', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    testScheduler.run(({ hot, expectObservable }) => {
      const action$ = hot('a-b-c', {
        a: youtubeVideoInserted('editor-name'),
        b: openInsertTweet('editor-name'),
        c: openMediapicker('TEXT_EDITOR', { editorName: 'editor-name' }),
      });

      expectObservable(
        closeInsertYoutubeVideoEpic(action$)
      ).toBe('a-a-a', {
        a: { type: CLOSE_INSERT_YOUTUBE_VIDEO, editorName: 'editor-name' },
      });
    });
  });
});
