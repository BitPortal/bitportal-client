/* @jsx */
/* global WxLogin */

import React, { Component } from 'react'
import Modal from 'components/Modal'
// import style from './style.css'

export default class WechatModal extends Component {
  componentDidMount() {
    new WxLogin({ // eslint-disable-line no-new
      id: 'login_container',
      appid: 'wx62bcefffe0705322',
      scope: 'snsapi_login',
      redirect_uri: 'http://www.dae.org/callback/wechat',
      state: '',
      style: '',
      href: ''
    })
  }

  render() {
    const { close } = this.props

    return (
      <Modal close={close}>
        <div id="login_container" />
      </Modal>
    )
  }
}
