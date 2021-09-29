import { StateObservable } from 'redux-observable'
import { of, Subject } from 'rxjs'
import {
  fetchEmbedTweetEpic,
  insertTweetEpic,
  renderInsertedTweetEpic,
} from './InsertTweet'
import {
  insertTweet,
  tweetInserted,
  embedTweetFetched,
  TWEET_INSERTED,
  EMBED_TWEET_FETCHED,
  ERROR,
} from '../../Redux/State/TextEditor/InsertTweet'
import { RENDER_TWEET } from '../../Redux/State/Tweet'

beforeEach(() => {
  document.body.innerHTML = `
    <div class="edited-text-root" data-editor-name="editor-name">
      <h1>This is a title</h1>
      <p>This is a little pargraph</p>
    </div>
  `;
});

describe('Epic :: TextEditor :: InsertTweet :: fetchEmbedTweetEpic', () => {
  const insertTweet$ = of(insertTweet());
  const state$ = new StateObservable(new Subject(), {});

  it('dispatches embedTweetFetched action', async () => {
    const dependencies = {
      fetchApi: () => Promise.resolve({ body: {}}),
    };

    const action = await fetchEmbedTweetEpic(insertTweet$, state$, dependencies)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(EMBED_TWEET_FETCHED);
  }, 1000);

  it('dispatches error action', async () => {
    const dependencies = {
      fetchApi: () => Promise.reject('fail !'),
    };

    const action = await fetchEmbedTweetEpic(insertTweet$, state$, dependencies)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(ERROR);
  }, 1000);
});

describe('Epic :: TextEditor :: InsertTweet :: insertTweetEpic', () => {
  const state$ = new StateObservable(new Subject(), {
    TextEditor: {
      ParagraphToolbox: {
        'editor-name': {
          targetNodeIndex: 1,
        },
      },
    },
  });

  it('dispatches tweetInserted action', async () => {
    const embedTweetFetched$ = of(embedTweetFetched(
      'editor-name',
      '<blockquote><p>test</p></blockquote>',
      'https://twitter.com/realDonaldTrump/status/1083756525196320773'
    ));

    const action = await insertTweetEpic(embedTweetFetched$, state$)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(TWEET_INSERTED);
  }, 1000);

  it('dispatches error action', async () => {
    const embedTweetFetched$ = of(embedTweetFetched(
      'wrong-editor-name',
      'badly formatted html string',
      'wrong url',
    ));

    const action = await insertTweetEpic(embedTweetFetched$, state$)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(ERROR);
  }, 1000);
});

describe('Epic :: TextEditor :: InsertTweet', () => {
  it('dispatches renderTweet action', async () => {
    const tweetInserted$ = of(tweetInserted('editor-name', '1', 'zxylog', '<p></p>'));
    const state$ = new StateObservable(new Subject(), {});

    const action = await renderInsertedTweetEpic(tweetInserted$, state$)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(RENDER_TWEET);
  }, 1000);
});
