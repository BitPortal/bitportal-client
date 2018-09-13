const fs = require('fs-extra')

const action = process.argv[2]
const type = process.argv[3]
const name = process.argv[4]

const actionContent = `import { createAction } from 'redux-actions'`

fs.ensureFile(`shared/actions/${name}.ts`, (error) => {
  if (error) throw error
  fs.writeFile(`shared/actions/${name}.ts`, actionContent, (error) => {
    if (error) throw error
  })
})

const reducerContent = `import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/${name}'

const initialState = Immutable.fromJS({

})

export default handleActions({

}, initialState)`

fs.ensureFile(`shared/reducers/${name}.ts`, (error) => {
  if (error) throw error
  fs.writeFile(`shared/reducers/${name}.ts`, reducerContent, (error) => {
    if (error) throw error
  })
})

const sagaContent = `import { takeEvery } from 'redux-saga/effects'
import * as actions from 'actions/${name}'

export default function* ${name}Saga() {

}`

fs.ensureFile(`shared/sagas/${name}.ts`, (error) => {
  if (error) throw error
  fs.writeFile(`shared/sagas/${name}.ts`, sagaContent, (error) => {
    if (error) throw error
  })
})

const selectorContent = `import { createSelector } from 'reselect'`

fs.ensureFile(`shared/selectors/${name}.ts`, (error) => {
  if (error) throw error
  fs.writeFile(`shared/selectors/${name}.ts`, selectorContent, (error) => {
    if (error) throw error
  })
})

fs.ensureFile(`shared/types/${name}.d.ts`, (error) => {
  if (error) throw error
  fs.writeFile(`shared/types/${name}.d.ts`, '', (error) => {
    if (error) throw error
  })
})
