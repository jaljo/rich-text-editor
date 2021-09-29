import {
  append,
  both,
  complement,
  cond,
  defaultTo,
  equals,
  filter,
  head,
  identity,
  ifElse,
  isNil,
  last,
  map,
  pipe,
  prop,
  range,
  split,
} from 'ramda'
import parseUrl from 'url-parse'

// toArray :: [Node] -> [Object]
const toArray = nodes => Object
  .values(nodes)
  .reduce((dest, node) => append(node, dest), [])

// isHeading :: Node -> Boolean
const isHeading = node => range(2, 7).map(x => `H${x}`).includes(node.tagName)
// createHeading :: Node -> Object
const createHeading = node => ({
  component: 'Heading',
  size: last(node.tagName),
  childComponents: createChildrenComponents(node.childNodes),
})

// isText :: Node -> Boolean
const isText = node => node.constructor.name === 'Text'
// createText :: Node -> Object
const createText = node => ({
  component: 'Text',
  text: node.textContent,
})

// isLink :: Node -> Boolean
const isLink = node => node.tagName === 'A'
// createLink :: Node -> Object
const createLink = node => ({
  component: 'Link',
  href: node.getAttribute('href'),
  title: node.getAttribute('title'),
  target: node.getAttribute('target'),
  childComponents: createChildrenComponents(node.childNodes),
})

// isEmphasis :: Node -> Boolean
const isEmphasis = node => node.tagName === 'EM'
const createEmphasis = node => ({
  component: 'Emphasis',
  childComponents: createChildrenComponents(node.childNodes),
})

// isStrong :: Node -> Boolean
const isStrong = node => node.tagName === 'STRONG'
const createStrong = node => ({
  component: 'Strong',
  childComponents: createChildrenComponents(node.childNodes),
})

// isUnderline :: Node -> Boolean
const isUnderline = node => node.tagName === 'U'
const createUnderline = node => ({
  component: 'Underline',
  childComponents: createChildrenComponents(node.childNodes),
})

// isItalic :: Node -> Boolean
const isItalic = node => node.tagName === 'I'
const createItalic = node => ({
  component: 'Italic',
  childComponents: createChildrenComponents(node.childNodes),
})

// isBold :: Node -> Boolean
const isBold = node => node.tagName === 'B'
const createBold = node => ({
    component: 'Bold',
    childComponents: createChildrenComponents(node.childNodes),
})

// isQuote :: Node -> Boolean
const isQuote = node => node.tagName === 'BLOCKQUOTE'
const createQuote = node => ({
    component: 'Quote',
    childComponents: createChildrenComponents(node.childNodes),
})

// isParagraph :: Node -> Boolean
const isParagraph = node => node.tagName === 'P'
// createParagraph :: Node -> Object
const createParagraph = node => ({
  component: 'Paragraph',
  childComponents: createChildrenComponents(node.childNodes),
})

// indicates whether the node is an image edited by this BO or not
// isImage :: Node -> Boolean
const isImage = node => node.tagName === 'FIGURE'
  && node.classList.contains('image-wrapper')
// createImage :: Node -> Object
const createImage = node => ({
  component: 'Image',
  src: node.childNodes[0] ? node.childNodes[0].getAttribute('src') : '',
  title: node.childNodes[2] ? node.childNodes[2].textContent : '',
  description: node.childNodes[1] ? node.childNodes[1].textContent : '',
  alt: node.childNodes[0] ? node.childNodes[0].getAttribute('alt') : '',
})
// indicates whether the node is an image edited by the legacy BO or not
// isLegacyImage :: Node -> Boolean
const isLegacyImage = node => node.tagName === 'P'
  && node.childNodes.length
  && node.childNodes[0].tagName === 'IMG'
// create an Image component from a legacy "<p><img /></p>" HTML
// createImageBC :: Node -> Object
const createImageBC = node => ({
  component: 'Image',
  src: node.childNodes[0].getAttribute('src'),
  title: node.childNodes[0].getAttribute('title'),
  description: node.childNodes[0].getAttribute('longdesc'),
  alt: node.childNodes[0].getAttribute('alt'),
})

// getTweetLink :: Node -> String
const getTweetLink = pipe(
  filter(isLink),
  toArray,
  last,
  defaultTo({href: ''}),
  prop('href'),
)
// getTweetIdFromUrl :: Node -> String
export const getTweetIdFromUrl = pipe(
  parseUrl,
  prop('pathname'),
  split('/'),
  last,
)
// isTweet :: Node -> Boolean
const isTweet = node => node.tagName === 'BLOCKQUOTE'
  && node.classList.contains('twitter-tweet')
// createTweet :: Node -> Object
const createTweet = node => ({
  component: 'Tweet',
  tweetId: pipe(
    getTweetLink,
    getTweetIdFromUrl,
  )(node.childNodes),
  originalHtmlMarkup: node.outerHTML,
})

// isYoutubeVideo :: Node -> Boolean
const isYoutubeVideo = node => node.tagName === 'IFRAME'
  && node.classList.contains('youtube-embed')

// createYoutubeVideo :: Node -> Object
const createYoutubeVideo = node => ({
  component: 'YoutubeVideo',
  src: node.getAttribute('src'),
})

// isBrightcoveVideo :: Node -> Boolean
const isBrightcoveVideo = node => node.tagName === 'DIV'
  && node.classList.contains('knp-rendered-video')

// createBrightcoveVideo :: Node -> Object
const createBrightcoveVideo = node => ({
  component: 'BrightcoveVideo',
  videoId: node.dataset.videoId,
})

// the order of predicates in this function is important, i.e. isQuote should
// never be before isTweet because they both check for BLOCKQUOTE tag.
// createComponent :: Node -> Object
const createComponent = cond([
  [isTweet, createTweet],
  [isImage, createImage],
  [isLegacyImage, createImageBC],
  [isParagraph, createParagraph],
  [isText, createText],
  [isEmphasis, createEmphasis],
  [isLink, createLink],
  [isHeading, createHeading],
  [isBrightcoveVideo, createBrightcoveVideo],
  [isItalic, createItalic],
  [isBold, createBold],
  [isUnderline, createUnderline],
  [isQuote, createQuote],
  [isStrong, createStrong],
  [isYoutubeVideo, createYoutubeVideo],
])

// createChildrenComponents :: [Node] -> [Object]
const createChildrenComponents = pipe(
  map(createComponent),
  toArray,
  filter(complement(isNil)),
)

// isDiv :: Node -> Boolean
const isDiv = pipe(prop('tagName'), equals('DIV'))
// hasSingleChild :: Node -> Boolean
const hasSingleChild = pipe(prop('children'), prop('length'), equals(1))
// firstNode :: Node -> Node
const firstNode = pipe(prop('children'), head)
// flattenDivNode :: Node -> Node
const flattenDivNode = () => ifElse(
  both(isDiv, hasSingleChild),
  pipe(firstNode, node => flattenDivNode()(node)),
  identity,
)
// flattenNodes :: Node -> Node
const flattenNodes = pipe(prop('childNodes'), map(flattenDivNode()))

// createRootNode :: String -> Node
const createRootNode = body => {
  const rootNode = document.createElement('div');

  rootNode.innerHTML = body || '';

  return flattenNodes(rootNode);
}

// default :: String -> [ComponentInfo]
// ComponentInfo : {
//  component: String,
//  ...any
// }
export default pipe(
  createRootNode,
  createChildrenComponents,
)
