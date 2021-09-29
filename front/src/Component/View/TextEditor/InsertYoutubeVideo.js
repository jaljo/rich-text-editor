import React from "react"

// InsertYoutubeVideo :: Props -> React.Component
const InsertYoutubeVideo = ({
  submit,
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

export default InsertYoutubeVideo;
