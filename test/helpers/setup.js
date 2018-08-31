/* global document, window */

import jsdom from 'jsdom'
import hook from 'css-modules-require-hook'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'

hook({ generateScopedName: '[local]_[hash:base64:5]' })
Enzyme.configure({ adapter: new Adapter() })
chai.use(chaiEnzyme())

const { JSDOM } = jsdom
const { document } = (new JSDOM('<!doctype html><html><body></body></html>')).window
const window = document.defaultView

global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0)
}

global.document = document
global.window = window
global.navigator = window.navigator
