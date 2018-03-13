const fs = require('fs-extra')
const path = require('path')

const supportedLocales = ['zh', 'en']
const targetFiles = ['messages.json']
const sourceDir = '../shared'
const outputDir = '../static/messages'

const initialMessages = supportedLocales.reduce(
  (messages, locale) => Object.assign(messages, { [locale]: {} }), {}
)

const walkSync = (dir, targetFileNames = []) =>
      fs.readdirSync(dir).reduce((messages, file) => {
        const filePath = path.join(dir, file)
        let newMessages = initialMessages
        if (fs.statSync(filePath).isDirectory()) {
          newMessages = Object.assign({}, walkSync(filePath, targetFileNames))
        }
        else if (targetFileNames.length && ~targetFileNames.indexOf(file)) {
          newMessages = fs.readJsonSync(filePath)
        }
        return supportedLocales.reduce(
          (mergedMessages, locale) => {
            mergedMessages[locale] = Object.assign(messages[locale], newMessages[locale])
            return mergedMessages
          }, {}
        )
      }, initialMessages)

const messages = walkSync(sourceDir, targetFiles)

const outputFiles = supportedLocales.reduce(
  (files, locale) => Object.assign(files, { [locale]: `${outputDir}/${locale}.json` }), {}
)

const generateLocaleFile = (locale) => {
  fs.ensureFile(outputFiles[locale], (error) => {
    if (error) throw error
    fs.writeJson(outputFiles[locale], messages[locale], { spaces: 2 }, (error) => {
      if (error) throw error
    })
  })
}

supportedLocales.forEach(locale => generateLocaleFile(locale))
