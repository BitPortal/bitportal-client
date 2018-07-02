import * as React from 'react'
import 'react-router'

declare module 'react-router' {
  export function withRouter<P, TFunction extends React.ComponentClass<P>>(target: TFunction): TFunction
}
