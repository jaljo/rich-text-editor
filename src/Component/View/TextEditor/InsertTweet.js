import React from 'react'

// InsertTweet :: Props -> React.Component
export default ({
  error = false,
  fetching = false,
  submit,
}) =>
  <form className="insert-tweet" onSubmit={submit}>
    <div className={`control ${fetching ? 'is-loading' : ''}`}>
      <input
        className="input"
        type="url"
        name="tweetLink"
        placeholder="Tweet link"
        autoFocus={true}
      />
    </div>
  </form>
