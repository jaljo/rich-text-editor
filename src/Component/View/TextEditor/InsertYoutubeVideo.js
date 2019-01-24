import React from 'react'

// InsertYoutubeVideo :: Props -> React.Component
export default ({
  submit,
  error = false,
}) =>
  <form className="insert-youtube" onSubmit={submit}>
    <div className="control">
      <input
        className="input"
        type="url"
        name="youtubeLink"
        placeholder="Youtube link"
        autoFocus={true}
      />
    </div>
  </form>
