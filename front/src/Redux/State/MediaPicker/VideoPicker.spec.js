import {
  fetchVideos,
  searchVideos,
  videosReceived,
  scrollLeft,
  scrollRight,
  clear,
  INITIAL_STATE,
  default as reducer,
} from "./VideoPicker"

describe("Redux :: State :: MediaPicker :: VideoPicker", () => {
  it("reduces to initial state by default", () => {
    expect(reducer()).toEqual(INITIAL_STATE);
  });

  it("reduces fetchVideos", () => {
    expect(
      reducer(INITIAL_STATE, fetchVideos())
    ).toEqual({
      ...INITIAL_STATE,
      isFetching: true,
    });
  });

  it("reduces searchVideos", () => {
    expect(
      reducer(INITIAL_STATE, searchVideos("Netanyahu"))
    ).toEqual({
      ...INITIAL_STATE,
      page: 1,
      searchString: "Netanyahu",
    });
  });

  it("reduces videosReceived", () => {
    expect(
      reducer(INITIAL_STATE, videosReceived([1,2,3]))
    ).toEqual({
      ...INITIAL_STATE,
      isFetching: false,
      videos: [1,2,3],
    });
  });

  it("reduces scrollLeft :: from page 1", () => {
    expect(
      reducer(INITIAL_STATE, scrollLeft())
    ).toEqual(INITIAL_STATE);
  });

  it("reduces scrollLeft :: from page > 1", () => {
    expect(
      reducer({ ...INITIAL_STATE, page: 13 }, scrollLeft())
    ).toEqual({
      ...INITIAL_STATE,
      page: 12,
    });
  });

  it("reduces scrollRight", () => {
    expect(
      reducer(INITIAL_STATE, scrollRight())
    ).toEqual({
      ...INITIAL_STATE,
      page: 2,
    });
  });

  it("reduces clear", () => {
    expect(
      reducer(INITIAL_STATE, clear())
    ).toEqual(INITIAL_STATE);
  });
});
