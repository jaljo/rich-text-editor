import React from 'react'
import uniqid from 'uniqid'
import { isNil } from 'ramda'

//  BrightcoveVideo :: Props -> React.Component
export default ({
  isReady,
  videoId,
  playerId,
  accountId,
  action,
  name,
  editable = true,
  componentId,
}) =>
  // brightcove SDK call wraps the video tag inside another element which breaks
  // react update. This uniqid key enforces this component to re-render itself.
  <div
    className="video-wrapper i24-rendered-video"
    key={uniqid(videoId)}
    data-video-id={videoId}
    contentEditable={false}
  >
    {editable &&
      <p
        className="i24-btn icomoon-font replace-video"
        onClick={action}
      >p</p>
    }
    {isReady &&
      <video
        className="video-js"
        data-embed="default"
        data-video-id={videoId}
        data-player={playerId}
        data-account={accountId}
        data-application-id={true}
        controls={true}
        autoPlay={false}
      ></video>
    }
    {!isNil(name) &&
      <figcaption>{name}</figcaption>
    }
  </div>
