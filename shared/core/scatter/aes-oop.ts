const sjcl = require('sjcl')

export class AES {
  static encrypt(data:any, key:string):string {
    let newData = data
	if(typeof newData === 'object') newData = JSON.stringify(newData)
	const {iv, salt, ct} = JSON.parse(sjcl.encrypt(key, newData, { mode:'gcm' }))
	return JSON.stringify({ iv, salt, ct })
  }

  static decrypt(encryptedData:string, key:string):any {
    const newEncryptedData = JSON.stringify(Object.assign(JSON.parse(encryptedData), { mode:'gcm' }))
	const clear = sjcl.decrypt(key, newEncryptedData)
	try { return JSON.parse(clear) } catch(e){ return clear }
  }
}

export default AES
