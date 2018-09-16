// import { createSelector } from 'reselect'

export const messageTypeSelector = (state: RootState) => state.dappBrowser.getIn(['pendingMessage', 'type'])
export const messageInfoSelector = (state: RootState) => state.dappBrowser.getIn(['pendingMessage', 'info'])
