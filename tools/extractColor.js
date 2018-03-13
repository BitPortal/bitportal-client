const fs = require('fs-extra')
const path = require('path')

const targetFiles = ['style.css']
const sourceDir = '../shared'
const css = ''

const walkSync = (dir, targetFileNames = []) =>
      fs.readdirSync(dir).reduce((css, file) => {
        const filePath = path.join(dir, file)
        if (fs.statSync(filePath).isDirectory()) {
          css = css + '\n' + walkSync(filePath, targetFileNames)
        }
        else if (targetFileNames.length && ~targetFileNames.indexOf(file)) {
          const fileContent = fs.readFileSync(filePath)
          css = css + '\n' + fileContent
          console.log('filepath: ', filePath)
          // if (!!~String(fileContent).indexOf(`--reserve-text-color`)) {
          //   console.log(true)
          // }
          // if (!!~String(fileContent).indexOf('--reserve-text-color')) {
          //   let newContent = String(fileContent).replace(/--reserve-text-color/g, '--reverse-text-color')
          //   // if (!~newContent.indexOf('@import')) {
          //   //   newContent = `@import 'resources/styles/variables.css';\n\n` + newContent
          //   // }
          //   fs.writeFileSync(filePath, newContent, 'utf8')
          //   console.log(newContent)
          // }
        }
        return css
      }, css)

const result = walkSync(sourceDir, targetFiles)

const hexColorThreeDigitsRe = new RegExp('#([a-fA-F0-9]){3}(?![a-fA-F0-9])', 'mig')
const hexColorSixDigitsRe = new RegExp('#([a-fA-F0-9]){6}(?![a-fA-F0-9])', 'mig')
const rgbColorRe = new RegExp('rgb\\([\\d]{1,3}([\\s]*\\,[\\s]*)[\\d]{1,3}([\\s]*\\,[\\s]*)[\\d]{1,3}[\\s]*\\)', 'mig')
const rgbaColorRe = new RegExp('rgba\\([\\d]{1,3}([\\s]*\\,[\\s]*)[\\d]{1,3}([\\s]*\\,[\\s]*)[\\d]{1,3}([\\s]*\\,[\\s]*)([\\d]|\\.)+[\\s]*\\)', 'mig')
const colorNamesRe = new RegExp('green|blue', 'mig')
const matchRe = [hexColorThreeDigitsRe, hexColorSixDigitsRe, rgbColorRe, rgbaColorRe, colorNamesRe]

const colors = []

matchRe.forEach(re => {
  let lastIndex = 0
  let match = re.exec(result)
  while(match) {
    colors.push(match[0])
    lastIndex = re.lastIndex
    match = re.exec(result.substring(lastIndex))
  }
})

const removeDuplicate = (arr) => {
  let o = {}
  for (let a of arr) {
    a = a.replace(/\s/g, '').toLowerCase()
    if (a.length === 4) a = a + a.substring(1)
    o[a] = a
  }
  return Object.keys(o)
}

const uniqueColors = removeDuplicate(colors)

console.log(colors.join('|'))
console.log('total: ', colors.length)
