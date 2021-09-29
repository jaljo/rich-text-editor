import "./App.scss";
import BrightcovePlayer from "./Container/BrightcovePlayer/BrightcovePlayer";
import MediaPicker from "./Container/MediaPicker/MediaPicker";
import {
  Provider,
} from "react-redux";
import React from "react";
import TextEditor from "./Container/TextEditor/TextEditor";

// App :: Props -> React.Component
const App = ({
  store,
}) =>
  <Provider store={ store }>
    <main>
      <BrightcovePlayer/>
      <MediaPicker/>
      <TextEditor editorName="article-editor" main>
        <h2>Hello there !</h2>
        <p>
          I hope you are having a <b>good time</b> trying this text editor :)
          To begin, try to select text and apply some modifications. If you
          focus an empty paragraph (i.e. press enter at the end of a line), you
          will be able to insert images, tweets or youtube videos.
        </p>
        <p>
          I`&lsquo;m doing my best to have other videos insertion fixed asap.
          Happy testing !
        </p>
      </TextEditor>
    </main>
  </Provider>;

export default App;
