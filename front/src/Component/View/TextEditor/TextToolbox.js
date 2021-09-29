import './TextToolbox.scss'
import {
  or,
} from 'ramda'
import React from 'react'

// TextToolbox :: Props -> React.Component
const TextToolbox = ({
  closeLinkCreator,
  handleLinkButton,
  handleLinkForm,
  isBold,
  isItalic,
  isLink,
  isLinkCreatorOpened,
  isQuote,
  isTitle,
  isUnderline,
  isVisible,
  mutate,
  top,
}) =>
  <aside
    className={ `text-toolbox ${ isVisible ? 'visible' : '' }` }
    style={ { top: top - 60 + 'px' } }
  >
    { !isLinkCreatorOpened &&
      <ul>
        <li>
          <button
            className={ `ttbx-mutation icomoon-font ${ isTitle ? 'active' : '' } ${ isQuote ? 'disabled' : '' }` }
            onClick={ () => mutate(isTitle ? 'PARAGRAPH' : 'TITLE') }
            disabled={ isQuote }
          >T</button>
        </li>
        <li>
          <button
            className={ `ttbx-mutation icomoon-font ${ isItalic ? 'active' : '' } ${ or(isTitle, isQuote) ? 'disabled' : '' }` }
            onClick={ () => mutate('ITALIC') }
            disabled={ or(isTitle, isQuote) }
          >5</button></li>
        <li>
          <button
            className={ `ttbx-mutation icomoon-font ${ isBold ? 'active' : '' } ${ isTitle ? 'disabled' : '' }` }
            onClick={ () => mutate('BOLD') }
            disabled={ isTitle }
          >4</button></li>
        <li>
          <button
            className={ `ttbx-mutation icomoon-font ${ isUnderline ? 'active' : '' } ${ isTitle ? 'disabled' : '' }` }
            onClick={ () => mutate('UNDERLINE') }
            disabled={ isTitle }
          >u</button></li>
        <li>
          <button
            className={ `ttbx-mutation icomoon-font ${ isLink ? 'active' : '' } ${ isTitle ? 'disabled' : '' }` }
            onClick={ () => handleLinkButton(isLink ? 'UNLINK' : 'LINK') }
            disabled={ isTitle }
          >L</button></li>
        <li>
          <button
            className={ `ttbx-mutation icomoon-font ${ isQuote ? 'active' : '' } ${ isTitle ? 'disabled' : '' }` }
            onClick={ () => mutate(isQuote ? 'PARAGRAPH' : 'QUOTE') }
            disabled={ isTitle }
          >_</button></li>
      </ul>
    }

    { isLinkCreatorOpened &&
      <div className="link-creator">
        <form onSubmit={ handleLinkForm }>
          <input
            className="href"
            type="url" name="href"
            placeholder="Paste or type a link..."
            required={ true }
            autoFocus={ true }
          />
        </form>
        <button
          className="ttbx-mutation close icomoon-font"
          onClick={ closeLinkCreator }
        >
          2
        </button>
      </div>
    }
    <div className="arrow"></div>
  </aside>

export default TextToolbox;
