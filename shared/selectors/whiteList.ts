import { createSelector } from 'reselect'

const dappListSelector = (state: RootState) => state.whiteList.get('dappList')
const dappNameSelector = (state: RootState) => state.whiteList.getIn(['selectedDapp', 'dappName'])

export const whiteListAuthorizedSelector = createSelector(
  dappNameSelector,
  dappListSelector,
  (dappName: string, dappList) => {
    let authorized = false
    dappList.forEach((v: any) => {
      if (v.get('dappName') === dappName) {
        authorized = v.get('authorized') || false
      }
    })
    return authorized
  }
)
