import React from 'react'
import { isEmpty } from 'ramda'
import './NoResult.scss'

// NoResult :: Props -> React.Component
export default ({
  resource,
  collection,
  isLoading,
  children,
}) =>
  <React.Fragment>
    {(!isLoading && isEmpty(collection)) &&
      <div className="message is-info">
        <div className="message-body">
          There is no {resource} matching your search criterias.
        </div>
      </div>
    }
    {!isEmpty(collection) && children}
  </React.Fragment>
