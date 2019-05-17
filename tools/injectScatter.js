const fs = require('fs-extra')

const iosFilePathScatter = 'ios/bitportal/injectScatter.js'
const filePathScatter = 'android/app/src/main/assets/raw/injectScatter.js'
const fileTextScatter = fs.readFileSync(iosFilePathScatter,'utf8')
const fileTextNewScatter = fileTextScatter.replace(/\%/g,`% `)

fs.writeFile(filePathScatter, fileTextScatter, (error) => {
  if (error) console.error(error)
  console.info(`${filePathScatter} updated!`)
})
