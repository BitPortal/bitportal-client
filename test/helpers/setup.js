/* global document, window */

import jsdom from 'jsdom'
import hook from 'css-modules-require-hook'

hook({
  generateScopedName: '[local]_[hash:base64:5]'
})

const { JSDOM } = jsdom
const { document } = (new JSDOM('<!doctype html><html><body></body></html>')).window
const window = document.defaultView

global.document = document
global.window = window
global.navigator = window.navigator
