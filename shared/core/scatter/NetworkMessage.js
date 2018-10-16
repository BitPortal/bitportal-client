import * as NetworkMessageTypes from './NetworkMessageTypes'

export default class NetworkMessage {
  constructor(_type = '', _payload = {}, _resolver = '', _domain = ''){
    this.type = _type
    this.payload = _payload
    this.resolver = _resolver
    this.domain = _domain
  }

  static placeholder(){ return new NetworkMessage() }

  static fromJson(json){
    const p = Object.assign(this.placeholder(), json)
    return p
  }

  static payload(type, payload){
    const p = this.placeholder()
    p.type = type
    p.payload = payload
    return p
  }

  static signal(type){
    const p = this.placeholder()
    p.type = type
    return p
  }

  respond(payload){ return new NetworkMessage(this.type, payload, this.resolver) }

  error(payload){ return new NetworkMessage(NetworkMessageTypes.ERROR, payload, this.resolver) }
}
