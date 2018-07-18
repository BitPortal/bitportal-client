/* @jsx */

import React from 'react'
import classNames from 'classnames'
import style from './style.css'

export const FormContainer = ({ children, center }) => (
  <div
    className={classNames({
      [style.formContainer]: true,
      [style.center]: !!center
    })}
  >
    {children}
  </div>
)

export const FieldItem = ({ children, type, hasError = false, center, withoutLabel }) => (
  <div
    className={classNames({
      [style.field]: true,
      [style.hasError]: hasError,
      [style.info]: type === 'info',
      [style.withoutLabel]: !!withoutLabel,
      [style.center]: !!center
    })}
  >
    {children}
  </div>
)

export const FieldInput = ({ children, symbol, leftSymbol, inactive, status }) => (
  <div className={style.fieldInput}>
    <div
      className={classNames({
        [style.content]: true,
        [style.hasSymbol]: !!symbol,
        [style.hasLeftSymbol]: !!leftSymbol,
        [style.inactive]: !!inactive
      })}
    >
      {leftSymbol && <span className={style.leftSymbol}>{leftSymbol}</span>}
      {children}
      {symbol && <span className={style.symbol}>{symbol}</span>}
    </div>
    {status && <span className={style.status}>{status}</span>}
  </div>
)

export const FieldError = ({ children }) => (
  <div className={style.fieldError}>
    {children}
  </div>
)

export const ServerError = ({ children }) => (
  <div className={style.serverError}>
    {children}
  </div>
)

export const ServerResult = ({ children, type = 'success' }) => (
  <div className={classNames({ [style.serverResult]: true, [style.success]: type === 'success', [style.error]: type === 'error' })}>
    {children}
  </div>
)
