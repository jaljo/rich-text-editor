import './App.scss'
import { Provider } from 'react-redux'
import React from 'react'
import BrightcovePlayer from './Container/BrightcovePlayer/BrightcovePlayer'
import TextEditor from './Container/TextEditor/TextEditor'
import MediaPicker from './Container/MediaPicker/MediaPicker'

// App :: Props -> React.Component
const App = ({
  store,
}) =>
  <Provider store={store}>
    <main>
      <BrightcovePlayer/>
      <MediaPicker/>
      <TextEditor editorName="article-editor" main>
        <h2>Hello there !</h2>
        <p>
          I hope you are having a <b>good time</b> trying this text editor :)
          To begin, try to select text and apply some modifications. If you focus
          an empty paragraph (i.e. press enter at the end of a line), you will
          be able to insert images or youtube videos.
        </p>
        <p>
          I'm doing my best to have tweet insertion fixed asap. Happy testing !
        </p>
      </TextEditor>
    </main>
  </Provider>

export default App;
