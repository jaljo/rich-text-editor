import React from 'react'
import { compose, map, nth } from 'ramda'
import { splitMedias, containsTenItems } from '../../../Util'
import './ImagePicker.scss'
import NoResult from '../List/NoResult'

// ImagePicker :: Props -> React.Component
export default ({
  scrollLeft,
  scrollRight,
  images,
  page,
  error,
  ...restProps
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
    <div className="container images">
      <NoResult resource="image" collection={images} isLoading={restProps.isFetching}>
        <div className="images-wrapper">
          <div className="columns">
            {compose(renderImages(restProps), nth(0), splitMedias)(images)}
          </div>
          <div className="columns">
            {compose(renderImages(restProps), nth(1), splitMedias)(images)}
          </div>
        </div>
      </NoResult>
    </div>
  </div>

// renderImages :: Props -> [Image] -> React.Component
const renderImages = (props) => map(image =>
  <div key={image.id} className="column is-one-fifth image">
    <img
      onClick={() => props.pickImage(image.id, props.domain, props.extra)}
      src={image.href}
      alt={image.legend}
    />
  </div>
)
