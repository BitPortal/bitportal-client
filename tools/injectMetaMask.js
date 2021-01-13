const fs = require('fs-extra')

const iosFilePathMetaMask = 'ios/bitportal/injectMetaMask.js'
const filePathMetaMask = 'android/app/src/main/assets/raw/injectMetaMask.js'
const fileTextMetaMask = fs.readFileSync(iosFilePathMetaMask,'utf8')
const fileTextNewMetaMask = fileTextMetaMask.replace(/\%/g,`% `)

fs.writeFile(filePathMetaMask, fileTextMetaMask, (error) => {
  if (error) console.error(error)
  console.info(`${filePathMetaMask} updated!`)
})
