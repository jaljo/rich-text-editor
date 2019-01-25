import { pipe, tap } from 'ramda'

// createWrapper :: String -> Element
const createWrapper = body => pipe(
  tap(e => e.innerHTML = body)
)(document.createElement('div'))

// createOriginalTweetElement :: Element, Object -> Element
const createOriginalTweetElement = (tweetElement, originalHtmlMarkups) => pipe(
  tap(wrapper => wrapper.innerHTML = originalHtmlMarkups[tweetElement.dataset.tweetId]),
  wrapper => wrapper.firstChild,
)(document.createElement('div'))

// sanitizeTweet :: Element, Object -> Void
const sanitizeTweet = (tweetElement, originalHtmlMarkups) => tweetElement
  .parentNode
  .replaceChild(
    createOriginalTweetElement(tweetElement, originalHtmlMarkups),
    tweetElement
  )

// sanitizeTweets :: State.Tweet.renderedTweets -> Element -> Element
// Reverts rendered tweets to their embed markup.
const sanitizeTweets = renderedTweets => pipe(
  tap(wrapper => Array
    .from(wrapper.getElementsByClassName('i24-rendered-tweet'))
    .reverse()
    .map(tweetElement => sanitizeTweet(tweetElement, renderedTweets))
  )
)

// sanitizeVideo :: Element -> Element
const sanitizeVideo = videoElement => videoElement.innerHTML = ''

// sanitizeBrightcoveVideos :: Node -> String
const sanitizeBrightcoveVideos = pipe(
  tap(wrapper => Array
    .from(wrapper.getElementsByClassName('i24-rendered-video'))
    .map(sanitizeVideo)
  )
)

// sanitizeContentBody :: Object -> String -> String
export const sanitizeContentBody = renderedTweets => pipe(
  createWrapper,
  sanitizeTweets(renderedTweets),
  sanitizeBrightcoveVideos(renderedVideos),
  wrapper => wrapper.innerHTML,
)
