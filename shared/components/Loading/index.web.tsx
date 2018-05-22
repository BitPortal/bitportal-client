import React, { Component } from 'react'
import Spinner from 'resources/icons/Spinner'
import style from './style.css'

export default class Loading extends Component {
  render () {
    return (
      <div className={style.loading}>
        <div>
          <Spinner color="#005eda" />
        </div>
      </div>
    )
  }
}
