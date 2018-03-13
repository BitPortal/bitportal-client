import 'redux-actions'

declare module 'redux-actions' {
  export interface ActionWithPayload<Payload> extends Action<Payload> {
    payload: Payload
  }
}
