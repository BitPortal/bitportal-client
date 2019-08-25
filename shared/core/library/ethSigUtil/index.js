import { keccak256 } from 'core/crypto'
import { web3 } from 'core/api'

const TYPED_MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    types: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {type: 'string'},
            type: {type: 'string'}
          },
          required: ['name', 'type']
        }
      }
    },
    primaryType: {type: 'string'},
    domain: {type: 'object'},
    message: {type: 'object'}
  },
  required: ['types', 'primaryType', 'domain', 'message']
}

const abiRawEncode = function (types, values) {
  return Buffer.from(web3.eth.abi.encodeParameter(types, values))
}

const findTypeDependencies = (primaryType, types, results = []) => {
  primaryType = primaryType.match(/^\w*/)[0]
  if (results.includes(primaryType) || types[primaryType] === undefined) { return results }
  results.push(primaryType)
  for (const field of types[primaryType]) {
    for (const dep of findTypeDependencies(field.type, types, results)) {
      !results.includes(dep) && results.push(dep)
    }
  }
  return results
}

const encodeType = (primaryType, types) => {
  let result = ''
  let deps = findTypeDependencies(primaryType, types).filter(dep => dep !== primaryType)
  deps = [primaryType].concat(deps.sort())
  for (const type of deps) {
    const children = types[type]
    if (!children) {
      throw new Error('No type definition specified: ' + type)
    }
    result += type + '(' + types[type].map(({ name, type }) => type + ' ' + name).join(',') + ')'
  }
  return result
}

const hashType = async (primaryType, types) => {
  return await keccak256(encodeType(primaryType, types))
}

const encodeData = async (primaryType, data, types, useV4 = true) => {
  const encodedTypes = ['bytes32']
  const encodedValues = [await hashType(primaryType, types)]

  if(useV4) {
    const encodeField = async (name, type, value) => {
      if (types[type] !== undefined) {
        return ['bytes32', value == null ?
                '0x0000000000000000000000000000000000000000000000000000000000000000' :
                (await keccak256(await encodeData(type, value, types, useV4)))]
      }

      if(value === undefined)
        throw new Error(`missing value for field ${name} of type ${type}`)

      if (type === 'bytes') {
        return ['bytes32', await keccak256(value)]
      }

      if (type === 'string') {
        // convert string to buffer - prevents ethUtil from interpreting strings like '0xabcd' as hex
        if (typeof value === 'string') {
          value = Buffer.from(value, 'utf8')
        }
        return ['bytes32', await keccak256(value)]
      }

      if (type.lastIndexOf(']') === type.length - 1) {
        const parsedType = type.slice(0, type.lastIndexOf('['))
        const typeValuePairs = value.map(item =>
                                         encodeField(name, parsedType, item))
        return ['bytes32', await keccak256(abiRawEncode(
          typeValuePairs.map(([type]) => type),
          typeValuePairs.map(([, value]) => value),
        ))]
      }

      return [type, value]
    }

    for (const field of types[primaryType]) {
      const [type, value] = await encodeField(field.name, field.type, data[field.name])
      encodedTypes.push(type)
      encodedValues.push(value)
    }
  } else {
    for (const field of types[primaryType]) {
      let value = data[field.name]
      if (value !== undefined) {
        if (field.type === 'bytes') {
          encodedTypes.push('bytes32')
          value = await keccak256(value)
          encodedValues.push(value)
        } else if (field.type === 'string') {
          encodedTypes.push('bytes32')
          // convert string to buffer - prevents ethUtil from interpreting strings like '0xabcd' as hex
          if (typeof value === 'string') {
            value = Buffer.from(value, 'utf8')
          }
          value = await keccak256(value)
          encodedValues.push(value)
        } else if (types[field.type] !== undefined) {
          encodedTypes.push('bytes32')
          value = await keccak256(await encodeData(field.type, value, types, useV4))
          encodedValues.push(value)
        } else if (field.type.lastIndexOf(']') === field.type.length - 1) {
          throw new Error('Arrays currently unimplemented in encodeData')
        } else {
          encodedTypes.push(field.type)
          encodedValues.push(value)
        }
      }
    }
  }

  return abiRawEncode(encodedTypes, encodedValues)
}

const sanitizeData = (data) => {
  const sanitizedData = {}
  for (const key in TYPED_MESSAGE_SCHEMA.properties) {
    data[key] && (sanitizedData[key] = data[key])
  }
  if (sanitizedData.types) {
    sanitizedData.types = Object.assign({ EIP712Domain: [] }, sanitizedData.types)
  }
  return sanitizedData
}

const sign = async (typedData, useV4 = true) => {
  const sanitizedData = sanitizeData(typedData)
  const parts = [Buffer.from('1901', 'hex')]

  parts.push(await hashStruct('EIP712Domain', sanitizedData.domain, sanitizedData.types, useV4))
  if (sanitizedData.primaryType !== 'EIP712Domain') {
    parts.push(await hashStruct(sanitizedData.primaryType, sanitizedData.message, sanitizedData.types, useV4))
  }

  return await keccak256(Buffer.concat(parts))
}

const hashStruct = async (primaryType, data, types, useV4 = true) => {
  return await keccak256(await encodeData(primaryType, data, types, useV4))
}

export const signTypedData = async (msgParams) => {
  const message = await sign(msgParams.data, false)
  return message
}

export const signTypedDataV4 = async (msgParams) => {
  const message = await sign(msgParams.data)
  return message
}
