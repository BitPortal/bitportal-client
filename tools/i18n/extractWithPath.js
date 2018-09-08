const fs = require('fs-extra')
const path = require('path')
const childProcess = require('child_process')

const supportedLocales = ['zh', 'en']
const targetFiles = ['messages.json']
const sourceDir = 'shared'
const outputDir = 'tools/i18n/output'
const ignoredDir = [
  'shared/actions',
  'shared/reducers',
  'shared/sagas',
  'shared/routes',
  'shared/types',
  'shared/store',
  'shared/utils',
  'shared/selectors',
  'shared/resources',
  'shared/constants',
  'shared/core'
]

const initialMessages = supportedLocales.reduce(
  (messages, locale) => Object.assign(messages, { [locale]: {} }), {}
)

const isEmpty = (obj) => {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false
  }

  return true
}

function dive(currentKey, into, target) {
  for (var i in into) {
    if (into.hasOwnProperty(i)) {
      var newKey = i
      var newVal = into[i]

      if (currentKey.length > 0) {
        newKey = currentKey + '~' + i
      }

      if (typeof newVal === "object") {
        dive(newKey, newVal, target)
      } else {
        target[newKey] = newVal
      }
    }
  }
}

function flatten(arr) {
  var newObj = {}
  dive('', arr, newObj)
  return newObj
}

const isIgnored = (filePath) => {
  return ignoredDir.filter(dir => dir.indexOf(filePath) !== -1).length > 0 || filePath.indexOf('.DS_Store') !== -1
}

const walkSync = (dir, targetFileNames = []) =>
      fs.readdirSync(dir).reduce((messages, file) => {
        const filePath = path.join(dir, file)
        if (isIgnored(filePath)) return messages
        let newMessages = initialMessages
        if (fs.statSync(filePath).isDirectory()) {
          newMessages = Object.assign({}, walkSync(filePath, targetFileNames))
        } else if (targetFileNames.length && ~targetFileNames.indexOf(file)) {
          newMessages = fs.readJsonSync(filePath)
        }

        return supportedLocales.reduce(
          (mergedMessages, locale) => {
            mergedMessages[locale] = { ...messages[locale], [filePath]: newMessages[locale] }
            return mergedMessages
          }, {}
        )
      }, initialMessages)

const messages = walkSync(sourceDir, targetFiles)

const combine = (object) => {
  const newObject = {}

  for (const key in object) {
    const info = key.split('~').slice(-2)
    const path = info[0]
    const stringId = info[1]
    if (newObject.hasOwnProperty(path)) {
      newObject[path][stringId] = object[key]
    } else {
      newObject[path] = { [stringId]: object[key] }
    }
  }

  return newObject
}

const flattenedMessages = supportedLocales.reduce(
  (files, locale) => {
    files[locale] = combine(flatten(messages[locale]))
    return files
  }, {}
)

const outputFiles = supportedLocales.reduce(
  (files, locale) => Object.assign(files, { [locale]: `${outputDir}/${locale}.json` }), {}
)

const generateLocaleFile = (locale) => {
  fs.ensureFile(outputFiles[locale], (error) => {
    if (error) throw error
    fs.writeJson(outputFiles[locale], flattenedMessages[locale], { spaces: 2 }, (error) => {
      if (error) throw error
      childProcess.exec(`open ${outputDir}`)
    })
  })
}

supportedLocales.forEach(locale => generateLocaleFile(locale))
