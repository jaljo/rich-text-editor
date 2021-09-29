import {
  FETCH_VIDEOS,
  fetchVideos,
  scrollLeft,
  scrollRight,
  searchVideos,
  VIDEOS_RECEIVED,
} from "../../Redux/State/MediaPicker/VideoPicker";
import {
  fetchVideosEpic,
  searchVideosEpic,
} from "./VideoPicker";
import {
  of,
  Subject,
} from "rxjs";
import {
  StateObservable,
} from "redux-observable";
import {
  TestScheduler,
} from "rxjs/testing";

describe("Epic :: MediaPicker :: VideoPicker :: fetchVideosEpic", () => {
  it("dispatches videosReceived", async () => {
    const fetchVideos$ = of(fetchVideos());
    const state$ = new StateObservable(new Subject(), {
      MediaPicker: {
        VideoPicker: {
          limit: 10,
          page: 12,
          searchString: "Netanyahu",
        },
      },
    });
    const dependencies = {
      fetchApi: () =>  new Promise(resolve => resolve({})),
    };

    const action = await fetchVideosEpic(fetchVideos$, state$, dependencies)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(VIDEOS_RECEIVED);
  }, 1000);
});

describe("Epic :: MediaPicker :: VideoPicker :: searchVideosEpic", () => {
  it("dispatches fetchVideos", () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    testScheduler.run(({ hot, expectObservable }) => {
      const action$ = hot("a-b----c", {
        a: scrollLeft(),
        b: scrollRight(),
        c: searchVideos("Netanyahu"),
      });

      expectObservable(
        searchVideosEpic(action$)
      ).toBe("a-a---- 250ms a", {
        a: { type: FETCH_VIDEOS },
      });
    });
  });
});
