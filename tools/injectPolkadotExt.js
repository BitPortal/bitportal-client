const fs = require('fs-extra')

const iosFilePathPolkadotExt = 'ios/bitportal/injectPolkadotExt.js'
const filePathPolkadotExt = 'android/app/src/main/assets/raw/injectPolkadotExt.js'
const fileTextPolkadotExt = fs.readFileSync(iosFilePathPolkadotExt,'utf8')
const fileTextNewPolkadotExt = fileTextPolkadotExt.replace(/\%/g,`% `)

fs.writeFile(filePathPolkadotExt, fileTextPolkadotExt, (error) => {
  if (error) console.error(error)
  console.info(`${filePathPolkadotExt} updated!`)
})
