import {
  isNil,
} from "ramda";
import React from "react";
import uniqid from "uniqid";

//  BrightcoveVideo :: Props -> React.Component
const BrightcoveVideo = ({
  isReady,
  videoId,
  playerId,
  accountId,
  action,
  name,
  editable = true,
}) =>
  /**
   * brightcove SDK call wraps the video tag inside another element which breaks
   * react update. This uniqid key enforces this component to re-render itself.
   */
  <div
    className="video-wrapper knp-rendered-video"
    key={ uniqid(videoId) }
    data-video-id={ videoId }
    contentEditable={ false }
  >
    { editable &&
      <p
        className="knp-btn icomoon-font replace-video"
        onClick={ action }
      >p</p>
    }
    { isReady &&
      <video
        className="video-js"
        data-embed="default"
        data-video-id={ videoId }
        data-player={ playerId }
        data-account={ accountId }
        data-application-id={ true }
        controls={ true }
        autoPlay={ false }
      ></video>
    }
    { !isNil(name) &&
      <figcaption>{ name }</figcaption>
    }
  </div>;

export default BrightcoveVideo;
