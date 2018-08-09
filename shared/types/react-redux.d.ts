import * as React from 'react'
import 'react-redux'

declare module 'react-redux' {
  export type InferableComponentEnhancerWithProps2<TInjectedProps, TNeedsProps> =
    <TComponent extends React.ComponentType<TInjectedProps & TNeedsProps>>(component: TComponent) => TComponent

  export type Connect = <TStateProps = {}, TDispatchProps = {}, TOwnProps = {}, TMergedProps = {}, State = {}>(
        mapStateToProps?: MapStateToPropsParam<TStateProps, TOwnProps, State>,
        mapDispatchToProps?: MapDispatchToPropsParam<TDispatchProps, TOwnProps>,
        mergeProps?: MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps>,
        options?: Options<TStateProps, TOwnProps, TMergedProps>
      ) => InferableComponentEnhancerWithProps2<TMergedProps, TOwnProps>
}
