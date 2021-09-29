import {
  default as reducer,
  INITIAL_STATE,
  RENDER_TWEET,
  renderTweet,
  tweetRendered,
  clear,
} from './Tweet'

describe('Redux :: State :: Tweet', () => {
  it('creates a RENDER_TWEET action', () => {
    expect(renderTweet(
      '1234',
      'uid',
      '<markup />'
    )).toEqual({
      type: RENDER_TWEET,
      tweetId: '1234',
      uid: 'uid',
      originalHtmlMarkup: '<markup />',
    });
  })

  it('reduces to initial state by default', () => {
    expect(reducer()).toEqual(INITIAL_STATE)
  })

  it('reduces TWEET_RENDERED action', () => {
    expect(
      reducer(INITIAL_STATE, tweetRendered('1234', '<p>tweet</p>'))
    )
      .toEqual({
        ...INITIAL_STATE,
        renderedTweets: {
          '1234': '<p>tweet</p>',
        },
      })
  })

  it('reduces CLEAR action', () => {
    expect(
      reducer(INITIAL_STATE, clear())
    ).toEqual(INITIAL_STATE)
  })
})
