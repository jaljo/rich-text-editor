import {
  INITIAL_STATE,
  playerLoaded,
  videoRendered,
  default as reducer,
} from './BrightcovePlayer'

describe('Redux :: State :: BrightcovePlayer', () => {
  it('reduces player loaded', () => {
    expect(
      reducer(INITIAL_STATE, playerLoaded('en'))
    ).toEqual({
      ...INITIAL_STATE,
      enPlayerReady: true,
    });

    expect(
      reducer(INITIAL_STATE, playerLoaded('fr'))
    ).toEqual({
      ...INITIAL_STATE,
      frPlayerReady: true,
    });

    expect(
      reducer(INITIAL_STATE, playerLoaded('ar'))
    ).toEqual({
      ...INITIAL_STATE,
      arPlayerReady: true,
    });
  });

  it('reduces videoRendered', () => {
    expect(
      reducer(INITIAL_STATE, videoRendered(12, '<video id="1234"></video>'))
    ).toEqual({
      ...INITIAL_STATE,
      renderedVideos: [
        { id: 12, originalHtmlMarkup: '<video id="1234"></video>' },
      ],
    });
  });
});
