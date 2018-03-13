const fs = require('fs-extra')
const path = require('path')
const csv = require('csvtojson')

const sourceDir = 'csvInput'
const outputDir = 'csvOutput'

const generateFileContent = (arr) => {
  const stringIds = {}
  stringIds.zh = arr.reduce((stringIds, item) => {
    stringIds[item.STRING_ID] = item.SIMPLIFIED_CHINESE
    return stringIds
  }, {})
  stringIds.en = arr.reduce((stringIds, item) => {
    stringIds[item.STRING_ID] = item.ENGLISH
    return stringIds
  }, {})
  const componentsString = arr.reduce((componentsString, item) => {
    return item.STRING_ID.trim().length ? `${componentsString}<FormattedMessage id="${item.STRING_ID}" />\n` : componentsString
  }, '')
  return `${JSON.stringify(stringIds, null, 2)}\n\n${componentsString}`
}

fs.readdirSync(sourceDir).map((file) => {
  const filePath = path.join(sourceDir, file)
  const csvArray = []
  csv().fromFile(filePath).on('json', (jsonObj) => {
    csvArray.push(jsonObj)
  }).on('done',(error) => {
    fs.writeFile(`${outputDir}/${file.split('.')[0]}.jsx`, generateFileContent(csvArray), (err) => {
      if(err) console.log(err)
      console.log(`${file.split('.')[0]}.jsx was saved in ${outputDir}.`)
    })
    return csvArray
  })
})
