import './VideoPicker.scss'
import {
  compose,
  isEmpty,
  isNil,
  map,
  nth,
} from 'ramda'
import {
  containsTenItems,
  splitMedias,
} from '../../../Util'
import React from 'react'

// VideoPicker :: Props -> React.Component
const VideoPicker = ({
  videos,
  scrollLeft,
  scrollRight,
  page,
  ...restProps
}) =>
  <div data-is="video-picker">
    {/* scroll left */}
    <p
      onClick={scrollLeft}
      className={`btn-knp left is-pulled-left icomoon-font ${page > 1 ? 'show' : ''}`}
    >l</p>
    {/* scroll right */}
    <p
      onClick={scrollRight}
      className={`btn-knp right is-pulled-right icomoon-font ${containsTenItems(videos) ? 'show' : ''}`}
    >r</p>

    {/* search result container */}
    <div className="videos">
      { isNil(videos) || isEmpty(videos) ?
        <div className="message is-info">
          <div className="message-body">
            There is no video matching your search criterias.
          </div>
        </div> :
        <div className="videos-wrapper">
          <div className="columns">
            {compose(renderVideos(restProps), nth(0), splitMedias)(videos)}
          </div>
          <div className="columns">
            {compose(renderVideos(restProps), nth(1), splitMedias)(videos)}
          </div>
        </div>
      }
    </div>
  </div>

// renderVideos :: Props -> [Video] -> React.Component
const renderVideos = props => map(video =>
  <div key={video.id} className="column is-one-fifth video">
    <img
      title={video.name}
      onClick={() => props.pickVideo(video.id, props.domain, props.extra)}
      src={video.poster}
      alt={video.name}
    />
  </div>,
)

export default VideoPicker;
