import React from 'react'
import './MediaPicker.css'
import ImagePicker from '../../Container/MediaPicker/ImagePicker'
import VideoPicker from '../../Container/MediaPicker/VideoPicker'

// MediaPicker :: Props -> React.Component
export default ({
  isOpened,
  close,
  isFetchingImages,
  isFetchingVideos,
  isImagePickerOpened,
  isVideoPickerOpened,
  searchImages,
  searchVideos,
  openImagePicker,
  openVideoPicker,
}) =>
  <div data-is="media-picker" className={`${!isOpened ? 'closed' : ''}`}>
    <div className="container search-images">
      <form onSubmit={e => e.preventDefault()}>
        <div className="columns">
          <div className="column is-9">
            { isImagePickerOpened &&
              <div className="field">
                <div className={`control has-icons-left ${isFetchingImages ? 'is-loading' : ''}`}>
                  <input className="input" type="text" onKeyUp={searchImages} placeholder="Search images"/>
                  <span className="icomoon-font icon is-small is-left">s</span>
                </div>
              </div>
            }
            { isVideoPickerOpened &&
              <div className="field">
                <div className={`control has-icons-left ${isFetchingVideos ? 'is-loading' : ''}`}>
                  <input className="input" type="text" onKeyUp={searchVideos} placeholder="Search videos"/>
                  <span className="icomoon-font icon is-small is-left">s</span>
                </div>
              </div>
            }
          </div>
          <div className="column is-3">
            <ul>
              <li>
                <p
                  className={`image-mode btn-knp ${isImagePickerOpened ? 'active' : ''}`}
                  onClick={e => isImagePickerOpened ? e.preventDefault() : openImagePicker()}
                ><span className="icomoon-font">c</span></p>
              </li>
              <li>
                <p
                  className={`video-mode btn-knp ${isVideoPickerOpened ? 'active' : ''}`}
                  onClick={e => isVideoPickerOpened ? e.preventDefault() : openVideoPicker()}
                ><span className="icomoon-font">3</span></p>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>

    { isImagePickerOpened && <ImagePicker/> }
    { isVideoPickerOpened && <VideoPicker/>}

    <p className="btn-knp close">
      <span className="icomoon-font" onClick={close}>e</span>
    </p>
  </div>
