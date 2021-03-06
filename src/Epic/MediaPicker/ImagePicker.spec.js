import { Subject } from 'rxjs'
import { ActionsObservable, StateObservable } from 'redux-observable'
import {
  fetchImages,
  scrollLeft,
  scrollRight,
  pickImage,
  ERROR,
  PICK_IMAGE_WITH_CREDITS,
  RECEIVED_IMAGES,
} from '../../Redux/State/MediaPicker/ImagePicker'
import { OPEN_IMAGE_PICKER } from '../../Redux/State/MediaPicker/MediaPicker'
import {
  searchImagesEpic,
  changePageEpic,
  ensurePickedImageHasCreditsEpic,
} from './ImagePicker'

const imagesMock = [
  {id: 33, legend: 'a image mock'},
  {id: 34, legend: 'another image mock'},
];
const dependencies = {
  fetchApi: () => new Promise((resolve, reject) => resolve({
    body: imagesMock,
  })),
};

describe('Epic :: MediaPicker :: ImagePicker :: searchImagesEpic', () => {
  const fetchImages$ = ActionsObservable.of(fetchImages());
  const state$ = new StateObservable(new Subject(), {
    Router: { params: { locale: 'en' }, }
  });

  it('dispatches receivedImages', done => {
    searchImagesEpic(fetchImages$, state$, dependencies)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(RECEIVED_IMAGES);
        expect(action.images).toEqual(imagesMock);
        done();
      })
      .catch(error => { fail(error); done(); });
  }, 1000);
});

describe('Epic :: MediaPicker :: ImagePicker :: changePageEpic', () => {
  const scrollLeft$ = ActionsObservable.of(scrollLeft());
  const scrollRight$ = ActionsObservable.of(scrollRight());
  const state$ = new StateObservable(new Subject(), {
    Router: { params: { locale: 'en' }, },
    MediaPicker: {
      ImagePicker: {
        page: 1,
        searchString: 'mock search string',
      },
    },
  });

  // @TODO rewrite this using rxjs TestScheduler
  it('dispatches receivedImages (after scrollLeft action)', done => {
    changePageEpic(scrollLeft$, state$, dependencies)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(RECEIVED_IMAGES);
        expect(action.images).toEqual(imagesMock);
        done();
      })
      .catch(error => { fail(error); done(); });
  }, 1000);

  it('dispatches receivedImages (after scrollRight action)', done => {
    changePageEpic(scrollRight$, state$, dependencies)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(RECEIVED_IMAGES);
        expect(action.images).toEqual(imagesMock);
        done();
      })
      .catch(error => { fail(error); done(); });
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

  it('dispatches pickImageWithCredits when image has credits', done => {
    const pickImage$ = ActionsObservable.of(pickImage(1));

    ensurePickedImageHasCreditsEpic(pickImage$, state$)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(PICK_IMAGE_WITH_CREDITS);
        done();
      })
      .catch(error => { fail(error); done(); });
  }, 1000);

  it('dispatches error when picked image has no credit', done => {
    const pickImage$ = ActionsObservable.of(pickImage(2));

    ensurePickedImageHasCreditsEpic(pickImage$, state$)
      .toPromise(Promise)
      .then(action => {
        expect(action.type).toEqual(ERROR);
        done();
      })
      .catch(error => { fail(error); done(); });
  }, 1000);
});
