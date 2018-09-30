const fs = require('fs-extra')
const filePath = 'android/app/src/main/assets/raw/inject.js'
const fileText = fs.readFileSync(filePath,'utf8')
const fileTextNew = fileText.replace(/\%/g,`% `)

fs.writeFile(filePath, fileTextNew, (error) => {
  if (error) console.error(error)
  console.info(`${filePath} updated!`)
})
