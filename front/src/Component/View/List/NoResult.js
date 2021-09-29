import "./NoResult.scss";
import {
  isEmpty,
} from "ramda";
import React from "react";

// NoResult :: Props -> React.Component
const NoResult = ({
  children,
  collection,
  isLoading,
  resource,
}) =>
  <React.Fragment>
    { (!isLoading && isEmpty(collection)) &&
      <div className="message is-info">
        <div className="message-body">
          There is no { resource } matching your search criterias.
        </div>
      </div>
    }
    { !isEmpty(collection) && children }
  </React.Fragment>;

export default NoResult;
