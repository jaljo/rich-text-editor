import {
  clear,
  INITIAL_STATE,
  default as reducer,
  RENDER_TWEET,
  renderTweet,
  tweetRendered,
} from './Tweet'

describe('Redux :: State :: Tweet', () => {
  it('creates a RENDER_TWEET action', () => {
    expect(renderTweet(
      '1234',
      'uid',
      '<markup />'
    )).toEqual({
      originalHtmlMarkup: '<markup />',
      tweetId: '1234',
      type: RENDER_TWEET,
      uid: 'uid',
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
