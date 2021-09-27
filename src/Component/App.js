import './App.scss'
import { Provider } from 'react-redux'
import React from 'react'
import BrightcovePlayer from './Container/BrightcovePlayer/BrightcovePlayer'
import TextEditor from './Container/TextEditor/TextEditor'
import MediaPicker from './Container/MediaPicker/MediaPicker'

// App :: Props -> React.Component
export default ({
  store,
  location,
}) =>
  <Provider store={store}>
    <main>
      <BrightcovePlayer/>
      <MediaPicker/>
      <TextEditor editorName="article-editor" main>
        <p></p>
      </TextEditor>
    </main>
  </Provider>
