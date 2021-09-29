import './TextEditor.scss'
import ParagraphToolbox from '../../Container/TextEditor/ParagraphToolbox'
import React from 'react'
import TextToolbox from '../../Container/TextEditor/TextToolbox'

// TextEditor :: Props -> React.Component
const TextEditor = ({
  children,
  click,
  editorName,
  keyDown,
  paste,
  selectText,
}) =>
  <div className="text-editor">
    <ParagraphToolbox editorName={ editorName } />
    <TextToolbox editorName={ editorName } />
    <article
      data-editor-name={ editorName }
      className="edited-text-root"
      contentEditable={ true }
      suppressContentEditableWarning={ true }
      onClick={ e => click(editorName, e.target) }
      onKeyDown={ keyDown }
      onPaste={ paste }
      onSelect={ () => selectText(editorName) }
    >
      { children }
    </article>
  </div>

export default TextEditor;
