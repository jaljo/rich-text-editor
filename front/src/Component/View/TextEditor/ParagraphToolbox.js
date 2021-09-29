import React from "react"
import InsertTweet from "../../Container/TextEditor/InsertTweet"
import InsertYoutubeVideo from "../../Container/TextEditor/InsertYoutubeVideo"
import "./ParagraphToolbox.scss"

// ParagraphToolbox :: Props -> React.Component
const ParagraphToolbox = ({
  closeInsertTweet,
  editorName,
  insertTweetOpened = false,
  isVisible = false,
  openInsertTweet,
  openMediaPicker,
  top = 0,
  insertYoutubeVideoOpened = false,
  openInsertYoutubeVideo,
  closeInsertYoutubeVideo,
  mediaPickerOpened,
}) =>
  <aside
    className={`paragraph-toolbox ${isVisible ? "visible" : ""}`}
    style={{top: top - 5 + "px"}}
  >
    <ul>
      <li>
        <button
          className={`btn-knp icomoon-font ${mediaPickerOpened ? "active" : ""}`}
          onClick={() => openMediaPicker("TEXT_EDITOR", { editorName })}
        >é</button>
      </li>
      {/* @TODO fix these features before re-enabling this
      <li>
        <button
          className="btn-knp icomoon-font"
          onClick={() => openMediaPicker('TEXT_EDITOR', { editorName }, 'videoPicker')}
        >3</button>
      </li>
      */}
      <li>
        <button
          className={`btn-knp icomoon-font ${insertTweetOpened ? "active" : ""}`}
          onClick={ insertTweetOpened ? closeInsertTweet : openInsertTweet}
        >0</button>
      </li>
      <li>
        <button
          className={`btn-knp icomoon-font ${insertYoutubeVideoOpened ? "active" : ""}`}
          onClick={ insertYoutubeVideoOpened ? closeInsertYoutubeVideo: openInsertYoutubeVideo }
        >Y</button>
      </li>
    </ul>
    { insertTweetOpened && <InsertTweet editorName={editorName} /> }
    { insertYoutubeVideoOpened && <InsertYoutubeVideo editorName={editorName} /> }
  </aside>

export default ParagraphToolbox;
