

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Modal from 'components/Modal'
import { accountLoaded, hasTradePassword, kycLevelOnePassed, kycLevelTwoPassed, kycLevelTwoReviewing } from 'selectors/kyc'
import style from './style.css'

@connect(
  state => ({
    loaded: accountLoaded(state),
    hasTradePassword: hasTradePassword(state),
    kycLevelOnePassed: kycLevelOnePassed(state),
    kycLevelTwoPassed: kycLevelTwoPassed(state),
    kycLevelTwoReviewing: kycLevelTwoReviewing(state)
  })
)

export default class BlockerModal extends Component {
  checkItems(checkItems, hasTradePassword, kycLevelOnePassed, kycLevelTwoPassed, kycLevelTwoReviewing) {
    if (~checkItems.indexOf('kycLevelOne') && !kycLevelOnePassed) {
      return 'kycLevelOne'
    } else if (~checkItems.indexOf('tradePassword') && !hasTradePassword) {
      return 'tradePassword'
    } else if (~checkItems.indexOf('kycLevelTwo') && !kycLevelTwoPassed) {
      return kycLevelTwoReviewing ? 'kycLevelTwoReviewing' : 'kycLevelTwo'
    }

    return null
  }

  renderNotice(item) {
    if (item === 'kycLevelOne') {
      return (
        <div>
          <span>请先完成基本信息验证再操作，</span>
          <Link to="/user-center/kyc/kyc-level-one">去设置</Link>
        </div>
      )
    } else if (item === 'tradePassword') {
      return (
        <div>
          <span>请先设置交易密码再操作，</span>
          <Link to="/user-center/transaction-password/set">去设置</Link>
        </div>
      )
    } else if (item === 'kycLevelTwo') {
      return (
        <div>
          <span>请先完成照片验证再操作，</span>
          <Link to="/user-center/kyc/kyc-level-two">去设置</Link>
        </div>
      )
    } else if (item === 'kycLevelTwoReviewing') {
      return (
        <div>
          <span>请先完成照片验证再操作，</span>
          <Link to="/user-center/kyc">去设置</Link>
        </div>
      )
    }

    return null
  }

  render() {
    const { loaded, checkItems, hasTradePassword, kycLevelOnePassed, kycLevelTwoPassed, kycLevelTwoReviewing } = this.props
    const item = this.checkItems(checkItems, hasTradePassword, kycLevelOnePassed, kycLevelTwoPassed, kycLevelTwoReviewing)

    return (
      <div className={style.blockerModal}>
        {(loaded && item) && <Modal title="注意">
          {this.renderNotice(item)}
        </Modal>}
      </div>
    )
  }
}
