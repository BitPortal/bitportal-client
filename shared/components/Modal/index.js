/* @jsx */
/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { goBack } from 'react-router-redux'
import ClickOutside from 'react-click-outside'
import classNames from 'classnames'
import CloseIcon from 'resources/icons/CloseIcon'
import style from './style.css'

export const ModalFooter = ({ children }) => <div className={style.modalFooter}>{children}</div>

export const ModalBody = ({ children }) => <div className={style.modalBody}>{children}</div>

@connect(
  () => ({}),
  dispatch => ({
    actions: bindActionCreators({ goBack }, dispatch)
  })
)

export class PageModal extends Component {
  constructor(props, context) {
    super(props, context)
    this.close = this.close.bind(this)
  }

  close() {
    this.props.actions.goBack()
  }

  render() {
    return (
      <div className={style.pageModal}>
        <div className={style.content}>
          <ClickOutside onClickOutside={this.close} className={style.contentBackground}>
            <a className={style.close} onClick={this.close}>
              <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M6 4.586l4.24-4.24c.395-.395 1.026-.392 1.416-.002.393.393.39 1.024 0 1.415L7.413 6l4.24 4.24c.395.395.392 1.026.002 1.416-.393.393-1.024.39-1.415 0L6 7.413l-4.24 4.24c-.395.395-1.026.392-1.416.002-.393-.393-.39-1.024 0-1.415L4.587 6 .347 1.76C-.05 1.364-.048.733.342.343c.393-.393 1.024-.39 1.415 0L6 4.587z" fillRule="evenodd" /></svg>
            </a>
            {this.props.children}
          </ClickOutside>
        </div>
      </div>
    )
  }
}

export default class Modal extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      animation: style.fadein
    }
    this.close = this.close.bind(this)
  }

  close() {
    this.setState({ animation: style.fadeout })

    if (this.props.close) {
      setTimeout(() => {
        this.props.close()
      }, 500)
    }
  }

  render() {
    const { title, close } = this.props

    return (
      <div
        className={classNames({
          [style.modal]: true,
          [style.isOpen]: true,
          [this.state.animation]: true }
        )}
      >
        <div className={style.container}>
          {title && <div className={style.header}>
            <span>{title}</span>
            {close && <div className={style.close} onClick={this.close}>
              <CloseIcon />
            </div>}
          </div>}
          {(!title && close) && <div className={style.close} onClick={this.close}>
            <CloseIcon />
          </div>}
          <div className={style.content}>
            <span>{this.props.children}</span>
          </div>
        </div>
      </div>
    )
  }
}
