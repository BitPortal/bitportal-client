/* @jsx */
/* eslint-disable */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './style.css'

interface Props {
  locale: Locale
  strength: number
}

@connect(
  state => ({
    locale: state.intl.get('locale')
  })
)

export default class PasswordStrength extends Component<Props, {}> {
  render() {
    const { strength, locale } = this.props

    return (
      <div className={style.passwordStrength}>
        <span className={style.label}>{locale === 'zh' ? '密码强度' : 'Password strength'}</span>
        <div className={style.level}>
          {!!strength && Array(strength).fill(1).map((_, i) => <span key={i} />)}
        </div>
      </div>
    )
  }
}
