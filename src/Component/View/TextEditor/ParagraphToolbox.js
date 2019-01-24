import React from 'react'
import InsertTweet from '../../Container/TextEditor/InsertTweet'
import InsertYoutubeVideo from '../../Container/TextEditor/InsertYoutubeVideo'
import './ParagraphToolbox.css'

// ParagraphToolbox :: Props -> React.Component
export default ({
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
    className={`paragraph-toolbox ${isVisible ? 'visible' : ''}`}
    style={{top: top - 5 + 'px'}}
  >
    <ul>
      <li>
        <button
          className={`btn-i24 icomoon-font ${mediaPickerOpened ? 'active' : ''}`}
          onClick={() => openMediaPicker('TEXT_EDITOR', { editorName })}
        >é</button>
      </li>
      <li>
        <button
          className="btn-i24 icomoon-font"
          onClick={() => openMediaPicker('TEXT_EDITOR', { editorName }, 'videoPicker')}
        >3</button>
      </li>
      <li>
        <button
          className={`btn-i24 icomoon-font ${insertTweetOpened ? 'active' : ''}`}
          onClick={ insertTweetOpened ? closeInsertTweet : openInsertTweet}
        >0</button>
      </li>
      <li>
        <button
          className={`btn-i24 icomoon-font ${insertYoutubeVideoOpened ? 'active' : ''}`}
          onClick={ insertYoutubeVideoOpened ? closeInsertYoutubeVideo: openInsertYoutubeVideo }
        >Y</button>
      </li>
    </ul>
    { insertTweetOpened && <InsertTweet editorName={editorName} /> }
    { insertYoutubeVideoOpened && <InsertYoutubeVideo editorName={editorName} /> }
  </aside>
