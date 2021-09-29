import TextToolbox from "../../Container/TextEditor/TextToolbox"
import ParagraphToolbox from "../../Container/TextEditor/ParagraphToolbox"
import React from "react"
import "./TextEditor.scss"

// TextEditor :: Props -> React.Component
const TextEditor = ({
  click,
  editorName,
  keyDown,
  paste,
  selectText,
  children,
}) =>
  <div className="text-editor">
    <ParagraphToolbox editorName={editorName} />
    <TextToolbox editorName={editorName} />
    <article
      data-editor-name={editorName}
      className="edited-text-root"
      contentEditable={true}
      suppressContentEditableWarning={true}
      onClick={e => click(editorName, e.target)}
      onKeyDown={keyDown}
      onPaste={paste}
      onSelect={() => selectText(editorName)}
    >
      {children}
    </article>
  </div>

export default TextEditor;
