import {
  Display as reducer,
  clear,
  close,
  open,
  openImagePicker,
  openVideoPicker,
  INITIAL_STATE,
} from './MediaPicker'

describe('Redux :: State :: MediaPicker :: MediaPicker', () => {
  it('reduces to initial state by default', () => {
    expect(reducer()).toEqual(INITIAL_STATE);
  });

  it('reduces open', () => {
    expect(
      reducer(INITIAL_STATE, open('mock-domain', { editor: 'test' }))
    ).toEqual({
      ...INITIAL_STATE,
      domain: 'mock-domain',
      extra: { editor: 'test' },
      imagePickerOpened: true,
      opened: true,
    });

    expect(
      reducer(INITIAL_STATE, open('mock-domain', null, 'videoPicker'))
    ).toEqual({
      ...INITIAL_STATE,
      domain: 'mock-domain',
      opened: true,
      videoPickerOpened: true,
    });
  });

  it('reduces close', () => {
    expect(
      reducer(INITIAL_STATE, close())
    ).toEqual(INITIAL_STATE);
  });

  it('reduces open image picker', () => {
    expect(
      reducer(INITIAL_STATE, openImagePicker())
    ).toEqual({
      ...INITIAL_STATE,
      imagePickerOpened: true,
    });
  });

  it('reduces openVideoPicker', () => {
    expect(
      reducer(INITIAL_STATE, openVideoPicker())
    ).toEqual({
      ...INITIAL_STATE,
      videoPickerOpened: true,
    });
  });

  it('reduces clear', () => {
    expect(
      reducer(INITIAL_STATE, clear())
    ).toEqual(INITIAL_STATE);
  });
});
