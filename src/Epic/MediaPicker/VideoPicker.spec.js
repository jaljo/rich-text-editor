import { ActionsObservable, StateObservable } from 'redux-observable'
import { Subject } from 'rxjs'
import { TestScheduler } from 'rxjs/testing'
import {
  fetchVideosEpic,
  searchVideosEpic,
} from './VideoPicker'
import {
  fetchVideos,
  scrollLeft,
  scrollRight,
  searchVideos,
  VIDEOS_RECEIVED,
  FETCH_VIDEOS,
} from '../../Redux/State/MediaPicker/VideoPicker'

describe('Epic :: MediaPicker :: VideoPicker :: fetchVideosEpic', () => {
  it('dispatches videosReceived', done => {
    const fetchVideos$ = ActionsObservable.of(fetchVideos());
    const state$ = new StateObservable(new Subject(), {
      Router: { params: { locale: 'en' }, },
      MediaPicker: {
        VideoPicker: {
          searchString: 'Netanyahu',
          page: 12,
          limit: 10,
        },
      },
    });
    const dependencies = {
      fetchApi: () =>  new Promise(resolve => resolve({})),
    };

    fetchVideosEpic(fetchVideos$, state$, dependencies)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(VIDEOS_RECEIVED)

        done()
      })
      .catch(err => { fail(err); done() });
  }, 1000);
});

describe('Epic :: MediaPicker :: VideoPicker :: searchVideosEpic', () => {
  it('dispatches fetchVideos', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    testScheduler.run(({ hot, cold, expectObservable }) => {
      const action$ = hot('a-b----c', {
        a: scrollLeft(),
        b: scrollRight(),
        c: searchVideos('Netanyahu'),
      });

      expectObservable(
        searchVideosEpic(action$)
      ).toBe('a-a---- 250ms a', {
        a: { type: FETCH_VIDEOS },
      });
    });
  });
});
