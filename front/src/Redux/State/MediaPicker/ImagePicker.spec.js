import {
  clear,
  error,
  fetchImages,
  INITIAL_STATE,
  pickImage,
  pickImageWithCredits,
  receivedImages,
  default as reducer,
  scrollLeft,
  scrollRight,
} from "./ImagePicker";

describe("Redux :: State :: MediaPicker :: ImagePicker", () => {
  it("reduces to initial state by default", () => {
    expect(reducer()).toEqual(INITIAL_STATE);
  });

  it("reduces fetch images", () => {
    expect(
      reducer(INITIAL_STATE, fetchImages("merkel"))
    ).toEqual({
      ...INITIAL_STATE,
      error: null,
      isFetching: true,
      page: 1,
      searchString: "merkel",
    });
  });

  it("reduces images received", () => {
    expect(
      reducer(INITIAL_STATE, receivedImages([{ id: 1 }, { id: 2 }]))
    ).toEqual({
      ...INITIAL_STATE,
      error: null,
      images: [{ id: 1 }, { id: 2 }],
      isFetching: false,
    });
  });

  it("reduces scroll left : first page", () => {
    expect(
      reducer(INITIAL_STATE, scrollLeft())
    ).toEqual({
      ...INITIAL_STATE,
      error: null,
      isFetching: true,
      page: 1,
    });
  });

  it("reduces scroll left : not first page", () => {
    expect(
      reducer({ ...INITIAL_STATE, page: 9 }, scrollLeft())
    ).toEqual({
      ...INITIAL_STATE,
      error: null,
      isFetching: true,
      page: 8,
    });
  });

  it("reduces scroll right", () => {
    expect(
      reducer(INITIAL_STATE, scrollRight())
    ).toEqual({
      ...INITIAL_STATE,
      error: null,
      isFetching: true,
      page: 2,
    });
  });

  it("reduces pick image", () => {
    expect(
      reducer(INITIAL_STATE, pickImage())
    ).toEqual({
      ...INITIAL_STATE,
      error: null,
    });
  });

  it("reduces pick image with credits", () => {
    expect(
      reducer(INITIAL_STATE, pickImageWithCredits())
    ).toEqual({
      ...INITIAL_STATE,
      error: null,
    });
  });

  it("reduces error", () => {
    expect(
      reducer(INITIAL_STATE, error("fail"))
    ).toEqual({
      ...INITIAL_STATE,
      error: "fail",
    });
  });

  it("reduces clear", () => {
    expect(
      reducer(INITIAL_STATE, clear())
    ).toEqual(INITIAL_STATE);
  });
});
