/* global document, window */

import Jsdom from 'jsdom'
import hook from 'css-modules-require-hook'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'

Enzyme.configure({ adapter: new Adapter() })
chai.use(chaiEnzyme())
hook({
  generateScopedName: '[local]_[hash:base64:5]'
})
global.document = Jsdom.jsdom('<body><div id="app"></div></body>')
global.window = document.defaultView
global.navigator = window.navigator
