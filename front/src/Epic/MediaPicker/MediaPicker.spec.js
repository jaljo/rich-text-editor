import { TestScheduler } from "rxjs/testing"
import { pickImageWithCredits } from "../../Redux/State/MediaPicker/ImagePicker"
import { pickVideo } from "../../Redux/State/MediaPicker/VideoPicker"
import { CLOSE, open } from "../../Redux/State/MediaPicker/MediaPicker"
import { closeMediaPickerEpic } from "./MediaPicker"
import {
  openInsertTweet,
  openInsertYoutubeVideo,
} from "../../Redux/State/TextEditor/ParagraphToolbox"

describe("Epic :: ArticleEditor :: closeMediaPickerEpic", () => {

  it("dispatches close", () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    testScheduler.run(({ hot, cold, expectObservable }) => {
      const action$ = hot("ab-ef-gh-ij", {
        a: open(),
        b: pickImageWithCredits(),
        e: open(),
        f: openInsertYoutubeVideo(),
        g: open(),
        h: openInsertTweet(),
        i: open(),
        j: pickVideo()
      });

      expectObservable(
        closeMediaPickerEpic(action$, null)
      ).toBe("-a--a--a--a", {
        a : { type: CLOSE },
      });
    });
  });
});
