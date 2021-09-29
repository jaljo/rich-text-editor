import React from 'react'
import uniqid from 'uniqid'
import { cond, T, always } from 'ramda'
import { indexedMap } from '../../../Util'
import TwitterWidget from '../../Container/Tweet/Tweet'
import BrightcoveVideo from '../../Container/BrightcovePlayer/BrightcoveVideo'

// is :: String -> Props -> Boolean
const is = type => ({ component }) => type === component.component

// renderChildren :: (String, [Children]) -> React.Component
const renderChildren = (parentId, children) => indexedMap((child, index) =>
  <Widget
    component={child}
    id={`${parentId}-${index}`}
    key={`${parentId}-${index}`}
  />,
)(children)

// Text :: Props -> React.Component
const Text = ({ component }) => component.text

// Tweet :: Props -> React.Component
const Tweet = ({ component }) =>
  <blockquote
    className="knp-rendered-tweet"
    data-tweet-id={component.tweetId}
  >
    <TwitterWidget
      tweetId={component.tweetId}
      uid={uniqid(component.tweetId)}
      originalHtmlMarkup={component.originalHtmlMarkup}
    />
  </blockquote>

/**
 * UnconnectedTwet :: (String, String) -> React.Component
 *
 * Renders the same markup as the Tweet component, whereas it is not connected
 * to the store.
 * We use this component to manually render it when inserting a new tweet
 * during text edition.
 */
export const UnconnectedTweet = (tweetId, uid) =>
  <blockquote
    className="knp-rendered-tweet"
    data-tweet-id={tweetId}
  >
    <div id={`tweet-${uid}`}></div>
  </blockquote>

/**
 * UnconnectedVideo :: (Video, String) -> React.Component
 *
 * Same logic as above, for brightcove videos.
 */
export const UnconnectedVideo = (video, playerId, accountId) =>
  <div
    className="video-wrapper knp-rendered-video"
    data-video-id={video.id}
    contentEditable={false}
  >
    <video
      className="video-js"
      data-embed="default"
      data-video-id={video.id}
      data-player={playerId}
      data-account={accountId}
      data-application-id={true}
      controls={true}
    ></video>
  </div>

// Paragraph :: Props -> React.Component
const Paragraph = ({
  component,
  id,
}) =>
  <p>
    {renderChildren(id, component.childComponents)}
  </p>

// Link :: Props -> React.Component
const Link = ({ component, id }) =>
  <a href={component.href} title={component.title} target={component.target} className="link">
    {renderChildren(id, component.childComponents)}
  </a>

// Image :: Props -> React.Component
export const Image = ({ component }) =>
  <figure className="image-wrapper">
    <img src={component.src} alt={component.alt || component.title || component.description} title={component.title} />
    <p className="credit" contentEditable={false}>
      {component.alt}
    </p>
    <figcaption>{component.title}</figcaption>
  </figure>

// BrightcoveVideoWidget :: Props -> React.Component
const BrightcoveVideoWidget = ({ component }) =>
  <BrightcoveVideo
    videoId={component.videoId}
    editable={false}
  />

// YoutubeVideo :: Props -> React.Component
const YoutubeVideo = ({ component }) =>
  <iframe
    className="youtube-embed"
    contentEditable={false}
    src={component.src}
    allowFullScreen={true}
    title={uniqid()}
  ></iframe>

// Heading :: Props -> React.Component
const Heading = ({ component, id }) => React.createElement(
  `h${component.size}`,
  [],
  renderChildren(id, component.childComponents),
)

// Emphasis :: Props -> React.Component
const Emphasis = ({ component, id }) =>
  <em>{renderChildren(id, component.childComponents)}</em>

// Strong :: Props -> React.Component
const Strong = ({ component, id }) =>
  <strong>{renderChildren(id, component.childComponents)}</strong>

// Italic :: Props -> React.Component
const Italic = ({ component, id }) =>
  <i>{renderChildren(id, component.childComponents)}</i>

// Bold :: Props -> React.Component
const Bold = ({ component, id }) =>
  <b>{renderChildren(id, component.childComponents)}</b>

// Underline :: Props -> React.Component
const Underline = ({ component, id }) =>
  <u>{renderChildren(id, component.childComponents)}</u>

// Quote :: Props -> React.Component
const Quote = ({ component, id }) =>
  <blockquote>{renderChildren(id, component.childComponents)}</blockquote>

// Widget :: Props -> React.Component
const Widget = cond([
  [is('Emphasis'), Emphasis],
  [is('Heading'), Heading],
  [is('Image'), Image],
  [is('Link'), Link],
  [is('Paragraph'), Paragraph],
  [is('Text'), Text],
  [is('Tweet'), Tweet],
  [is('Italic'), Italic],
  [is('Bold'), Bold],
  [is('Underline'), Underline],
  [is('Quote'), Quote],
  [is('Strong'), Strong],
  [is('YoutubeVideo'), YoutubeVideo],
  [is('BrightcoveVideo'), BrightcoveVideoWidget],
  [T, always(null)],
])

export default Widget
