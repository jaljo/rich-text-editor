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
} from "ramda";
import parseUrl from "url-parse";

// toArray :: [Node] -> [Object]
const toArray = nodes => Object
  .values(nodes)
  .reduce((dest, node) => append(node, dest), []);

// isHeading :: Node -> Boolean
const isHeading = node => range(2, 7).map(x => `H${x}`).includes(node.tagName);

// createHeading :: Node -> Object
const createHeading = node => ({
  childComponents: createChildrenComponents(node.childNodes),
  component: "Heading",
  size: last(node.tagName),
});

// isText :: Node -> Boolean
const isText = node => node.constructor.name === "Text";

// createText :: Node -> Object
const createText = node => ({
  component: "Text",
  text: node.textContent,
});

// isLink :: Node -> Boolean
const isLink = node => node.tagName === "A";

// createLink :: Node -> Object
const createLink = node => ({
  childComponents: createChildrenComponents(node.childNodes),
  component: "Link",
  href: node.getAttribute("href"),
  target: node.getAttribute("target"),
  title: node.getAttribute("title"),
});

// isEmphasis :: Node -> Boolean
const isEmphasis = node => node.tagName === "EM";

// createEmphasis :: Node :: Object
const createEmphasis = node => ({
  childComponents: createChildrenComponents(node.childNodes),
  component: "Emphasis",
});

// isStrong :: Node -> Boolean
const isStrong = node => node.tagName === "STRONG";

// createStrong :: Node -> Object
const createStrong = node => ({
  childComponents: createChildrenComponents(node.childNodes),
  component: "Strong",
});

// isUnderline :: Node -> Boolean
const isUnderline = node => node.tagName === "U";

// createUnderline :: Node -> Object
const createUnderline = node => ({
  childComponents: createChildrenComponents(node.childNodes),
  component: "Underline",
});

// isItalic :: Node -> Boolean
const isItalic = node => node.tagName === "I";

// createItalic :: Node -> Object
const createItalic = node => ({
  childComponents: createChildrenComponents(node.childNodes),
  component: "Italic",
});

// isBold :: Node -> Boolean
const isBold = node => node.tagName === "B";

// createBold :: Node -> Object
const createBold = node => ({
  childComponents: createChildrenComponents(node.childNodes),
  component: "Bold",
});

// isQuote :: Node -> Boolean
const isQuote = node => node.tagName === "BLOCKQUOTE";

// createQuote :: Node -> Object
const createQuote = node => ({
  childComponents: createChildrenComponents(node.childNodes),
  component: "Quote",
});

// isParagraph :: Node -> Boolean
const isParagraph = node => node.tagName === "P";

// createParagraph :: Node -> Object
const createParagraph = node => ({
  childComponents: createChildrenComponents(node.childNodes),
  component: "Paragraph",
});

/**
 * isImage :: Node -> Boolean
 *
 * indicates whether the node is an image edited by this BO or not
 */
const isImage = node => node.tagName === "FIGURE"
  && node.classList.contains("image-wrapper");
// createImage :: Node -> Object
const createImage = node => ({
  alt: node.childNodes[0] ? node.childNodes[0].getAttribute("alt") : "",
  component: "Image",
  description: node.childNodes[1] ? node.childNodes[1].textContent : "",
  src: node.childNodes[0] ? node.childNodes[0].getAttribute("src") : "",
  title: node.childNodes[2] ? node.childNodes[2].textContent : "",
});

/**
 * isLegacyImage :: Node -> Boolean
 *
 * indicates whether the node is an image edited by the legacy BO or not
 */
const isLegacyImage = node => node.tagName === "P"
  && node.childNodes.length
  && node.childNodes[0].tagName === "IMG";

/**
 * createImageBC :: Node -> Object
 *
 * create an Image component from a legacy "<p><img /></p>" HTML
 */
const createImageBC = node => ({
  alt: node.childNodes[0].getAttribute("alt"),
  component: "Image",
  description: node.childNodes[0].getAttribute("longdesc"),
  src: node.childNodes[0].getAttribute("src"),
  title: node.childNodes[0].getAttribute("title"),
});

// getTweetLink :: Node -> String
const getTweetLink = pipe(
  filter(isLink),
  toArray,
  last,
  defaultTo({ href: "" }),
  prop("href"),
);

// getTweetIdFromUrl :: Node -> String
export const getTweetIdFromUrl = pipe(
  parseUrl,
  prop("pathname"),
  split("/"),
  last,
);

// isTweet :: Node -> Boolean
const isTweet = node => node.tagName === "BLOCKQUOTE"
  && node.classList.contains("twitter-tweet");

// createTweet :: Node -> Object
const createTweet = node => ({
  component: "Tweet",
  originalHtmlMarkup: node.outerHTML,
  tweetId: pipe(
    getTweetLink,
    getTweetIdFromUrl,
  )(node.childNodes),
});

// isYoutubeVideo :: Node -> Boolean
const isYoutubeVideo = node => node.tagName === "IFRAME"
  && node.classList.contains("youtube-embed");

// createYoutubeVideo :: Node -> Object
const createYoutubeVideo = node => ({
  component: "YoutubeVideo",
  src: node.getAttribute("src"),
});

// isBrightcoveVideo :: Node -> Boolean
const isBrightcoveVideo = node => node.tagName === "DIV"
  && node.classList.contains("knp-rendered-video");

// createBrightcoveVideo :: Node -> Object
const createBrightcoveVideo = node => ({
  component: "BrightcoveVideo",
  videoId: node.dataset.videoId,
});

/**
 * createComponent :: Node -> Object
 *
 * the order of predicates in this function is important, i.e. isQuote should
 * never be before isTweet because they both check for BLOCKQUOTE tag.
 */
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
]);

// createChildrenComponents :: [Node] -> [Object]
const createChildrenComponents = pipe(
  map(createComponent),
  toArray,
  filter(complement(isNil)),
);

// isDiv :: Node -> Boolean
const isDiv = pipe(prop("tagName"), equals("DIV"));

// hasSingleChild :: Node -> Boolean
const hasSingleChild = pipe(prop("children"), prop("length"), equals(1));

// firstNode :: Node -> Node
const firstNode = pipe(prop("children"), head);

// flattenDivNode :: Node -> Node
const flattenDivNode = () => ifElse(
  both(isDiv, hasSingleChild),
  pipe(firstNode, node => flattenDivNode()(node)),
  identity,
);

// flattenNodes :: Node -> Node
const flattenNodes = pipe(prop("childNodes"), map(flattenDivNode()));

// createRootNode :: String -> Node
const createRootNode = body => {
  const rootNode = document.createElement("div");

  rootNode.innerHTML = body || "";

  return flattenNodes(rootNode);
};

// HtmlToComponent :: String -> [HtmlToComponent]
export default pipe(
  createRootNode,
  createChildrenComponents,
);
