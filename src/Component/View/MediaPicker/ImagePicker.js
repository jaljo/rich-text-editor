import React from 'react'
import { containsTenItems } from '../../../Util'
import './ImagePicker.scss'
import NoResult from '../List/NoResult'

// ImagePicker :: Props -> React.Component
const ImagePicker = ({
  scrollLeft,
  scrollRight,
  images,
  page,
  isFetching,
  domain,
  extra,
  pickImage,
}) =>
  <div data-is="image-picker">
    {/* scroll left */}
    <p
      onClick={scrollLeft}
      className={`btn-knp left is-pulled-left is-hidden-mobile ${page > 1 ? 'show' : ''}`}
    >
      <span className="icomoon-font">l</span>
    </p>
    {/* scroll right */}
    <p
      onClick={scrollRight}
      className={`btn-knp right is-pulled-right is-hidden-mobile ${containsTenItems(images) ? 'show' : ''}`}
    >
      <span className="icomoon-font">r</span>
    </p>

    {/* search result container */}
    <div className="images">
      <NoResult resource="image" collection={images} isLoading={isFetching}>
        <div className="images-wrapper">
          <div className="row">
            {renderImages(images.slice(0, 5), pickImage, domain, extra)}
          </div>
          <div className="row">
            {renderImages(images.slice(5, 10), pickImage, domain, extra)}
          </div>
        </div>
      </NoResult>
    </div>
  </div>

// renderImages :: ([Image], Function, String, Object) -> React.Component
const renderImages = (images, pickImage, domain, extra) => images.map(image =>
  <div key={image.id} className="image">
    <img
      onClick={() => pickImage(image.id, domain, extra)}
      src={image.href}
      alt={image.legend}
    />
  </div>
)

export default ImagePicker;
