const fs = require('fs-extra')
const path = require('path')
const outputDir = 'tools/i18n/output'
const supportedLocales = ['zh', 'en']

function deepEqual(a, b)
{
  if( (typeof a == 'object' && a != null) &&
      (typeof b == 'object' && b != null) )
  {
    var count = [0,0]
    for(const key in a) count[0]++
    for(const key in b) count[1]++
    if( count[0]-count[1] != 0) {return false}
    for(const key in a)
    {
      if(!(key in b) || !deepEqual(a[key],b[key])) {return false}
    }
    for(const key in b)
    {
      if(!(key in a) || !deepEqual(b[key],a[key])) {return false}
    }
    return true
  } else {
    return a === b
  }
}

const saveFile = (path, locale, content) => {
  return new Promise(function(reslove, reject) {
    fs.ensureFile(path, (error) => {
      if (error) reject(error)
      fs.writeJson(path, content, { spaces: 2 }, (error) => {
        if (error) reject(error)
        console.info(`${path} ${locale} updated!`)
        reslove(true)
      })
    })
  })
}

const importMessage = async () => {
  for (const locale of supportedLocales) {
    const messages = fs.readJsonSync(`${outputDir}/${locale}.json`)

    for (const path in messages) {
      const message = fs.readJsonSync(path)

      if (!deepEqual(message[locale], messages[path])) {
        await saveFile(path, locale, { ...message, [locale]: messages[path] })
      }
    }
  }
}

importMessage()
