import { Subject, of } from 'rxjs'
import { StateObservable } from 'redux-observable'
import {
  fetchImages,
  scrollLeft,
  scrollRight,
  pickImage,
  ERROR,
  PICK_IMAGE_WITH_CREDITS,
  RECEIVED_IMAGES,
} from '../../Redux/State/MediaPicker/ImagePicker'
import {
  searchImagesEpic,
  changePageEpic,
  ensurePickedImageHasCreditsEpic,
} from './ImagePicker'

const imagesMock = [
  {
    id: 1,
    src: {
      medium: "href"
    },
    photographer_url: "photographer url",
    photographer: "photographer",
  },
];
const transformedImages = [
  {
    id: 1,
    href: "href",
    legend: "photographer url",
    credit: "photographer",
  }
];
const dependencies = {
  fetchApi: () => Promise.resolve({
    photos: imagesMock,
  }),
};

describe('Epic :: MediaPicker :: ImagePicker :: searchImagesEpic', () => {
  const fetchImages$ = of(fetchImages());

  it('dispatches receivedImages', async () => {
    const action = await searchImagesEpic(fetchImages$, null, dependencies)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(RECEIVED_IMAGES);
    expect(action.images).toEqual(transformedImages);
  }, 1000);
});

describe('Epic :: MediaPicker :: ImagePicker :: changePageEpic', () => {
  const scrollLeft$ = of(scrollLeft());
  const scrollRight$ = of(scrollRight());
  const state$ = new StateObservable(new Subject(), {
    MediaPicker: {
      ImagePicker: {
        page: 1,
        searchString: 'mock search string',
      },
    },
  });

  // @TODO rewrite this using rxjs TestScheduler
  it('dispatches receivedImages (after scrollLeft action)', async () => {
    const action = await changePageEpic(scrollLeft$, state$, dependencies)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(RECEIVED_IMAGES);
    expect(action.images).toEqual(transformedImages);
  }, 1000);

  it('dispatches receivedImages (after scrollRight action)', async () => {
   const action = await changePageEpic(scrollRight$, state$, dependencies)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(RECEIVED_IMAGES);
    expect(action.images).toEqual(transformedImages);
  }, 1000);
});

describe('Epic :: MediaPicker :: ImagePicker :: ensurePickedImageHasCreditsEpic', () => {
  const state$ = new StateObservable(new Subject(), {
    MediaPicker: {
      ImagePicker: {
        images: [
            { id: 1, legend: 'This image has credit', credit: 'AFP' },
            { id: 2, legend: 'This one does not', credit: '' },
        ],
      },
    },
  })

  it('dispatches pickImageWithCredits when image has credits', async () => {
    const pickImage$ = of(pickImage(1));

    const action = await ensurePickedImageHasCreditsEpic(pickImage$, state$)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(PICK_IMAGE_WITH_CREDITS);
  }, 1000);

  it('dispatches error when picked image has no credit', async() => {
    const pickImage$ = of(pickImage(2));

    const action = await ensurePickedImageHasCreditsEpic(pickImage$, state$)
      .toPromise(Promise)
    ;

    expect(action.type).toEqual(ERROR);
  }, 1000);
});
