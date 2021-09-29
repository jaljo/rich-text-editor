import "./ParagraphToolbox.scss";
import InsertTweet from "../../Container/TextEditor/InsertTweet";
import InsertYoutubeVideo from "../../Container/TextEditor/InsertYoutubeVideo";
import React from "react";

// ParagraphToolbox :: Props -> React.Component
const ParagraphToolbox = ({
  closeInsertTweet,
  closeInsertYoutubeVideo,
  editorName,
  insertTweetOpened = false,
  insertYoutubeVideoOpened = false,
  isVisible = false,
  mediaPickerOpened,
  openInsertTweet,
  openInsertYoutubeVideo,
  openMediaPicker,
  top = 0,
}) =>
  <aside
    className={ `paragraph-toolbox ${ isVisible ? "visible" : "" }` }
    style={ { top: top - 5 + "px" } }
  >
    <ul>
      <li>
        <button
          className={ `btn-knp icomoon-font ${ mediaPickerOpened ? "active" : "" }` }
          onClick={ () => openMediaPicker("TEXT_EDITOR", { editorName }) }
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
          className={ `btn-knp icomoon-font ${ insertTweetOpened ? "active" : "" }` }
          onClick={ insertTweetOpened ? closeInsertTweet : openInsertTweet }
        >0</button>
      </li>
      <li>
        <button
          className={ `btn-knp icomoon-font ${ insertYoutubeVideoOpened ? "active" : "" }` }
          onClick={ insertYoutubeVideoOpened ? closeInsertYoutubeVideo: openInsertYoutubeVideo }
        >Y</button>
      </li>
    </ul>
    { insertTweetOpened && <InsertTweet editorName={ editorName } /> }
    { insertYoutubeVideoOpened && <InsertYoutubeVideo editorName={ editorName } /> }
  </aside>;

export default ParagraphToolbox;
