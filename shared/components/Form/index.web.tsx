import React from 'react'
import classNames from 'classnames'
import style from './style.css'

interface FormContainerProps {
  center?: boolean
}

interface FieldItemProps {
  type: string
  hasError: boolean
  center?: boolean
  withoutLabel?: boolean
}

interface FieldInputProps {
  symbol?: string
  leftSymbol?: string
  inactive?: boolean
  status?: JSX.Element | string
}

interface ServerResultProps {
  type: 'success' | 'error'
}

export const FormContainer: React.SFC<FormContainerProps> = ({ children, center }) => (
  <div
    className={classNames({
      [style.formContainer]: true,
      [style.center]: !!center
    })}
  >
    {children}
  </div>
)

export const FieldItem: React.SFC<FieldItemProps> = ({ children, type, hasError = false, center, withoutLabel }) => (
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

export const FieldInput: React.SFC<FieldInputProps> = ({ children, symbol, leftSymbol, inactive, status }) => (
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

export const FieldError: React.SFC = ({ children }) => (
  <div className={style.fieldError}>
    {children}
  </div>
)

export const ServerError: React.SFC = ({ children }) => (
  <div className={style.serverError}>
    {children}
  </div>
)

export const ServerResult: React.SFC<ServerResultProps> = ({ children, type = 'success' }) => (
  <div className={classNames({ [style.serverResult]: true, [style.success]: type === 'success', [style.error]: type === 'error' })}>
    {children}
  </div>
)
