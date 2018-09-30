import { createSelector } from 'reselect'
import Immutable from 'immutable'
import { EOS_MAINNET_NODES } from 'constants/chain'

export const getInitialEOSNode = (presetActiveNode?: string, presetCustomNodes?: any) => Immutable.fromJS({
  activeNode: presetActiveNode || EOS_MAINNET_NODES[0],
  defaultNodes: EOS_MAINNET_NODES.map((node: string, index: number) => ({ id: index, url: node })),
  customNodes: presetCustomNodes || []
})

export const activeNodeSelector = (state: RootState) => state.eosNode.get('activeNode')
export const customNodesSelector = (state: RootState) => state.eosNode.get('customNodes')
export const defaultNodesSelector = (state: RootState) => state.eosNode.get('defaultNodes')

export const eosNodesSelector = createSelector(
  defaultNodesSelector,
  customNodesSelector,
  (defaultNodes: any, customNodes: any) => defaultNodes.concat(customNodes)
)
