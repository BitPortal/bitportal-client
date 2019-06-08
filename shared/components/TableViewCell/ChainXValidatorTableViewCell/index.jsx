import React from 'react'
import { View, Text } from 'react-native'

const ChainXValidatorTableViewCell = (props) => {
  const formatBalance = (balance, num = 8) => (parseInt(balance) * Math.pow(10, -8)).toFixed(num)
  console.log(props)
  let pendingInterest = 0
  if (props.data.userNomination !== '-') {
    // 最新总票龄 = 总票龄 + 总投票金额 *（当前高度 - 总票龄更新高度）
    const latestTotalVoteWeight = props.data.lastTotalVoteWeight + props.data.totalNomination * (props.data.blockHeight - props.data.lastTotalVoteWeightUpdate)

    console.log('latestTotalVoteWeight', latestTotalVoteWeight, props.data.lastTotalVoteWeight, props.data.totalNomination, props.data.blockHeight - props.data.lastTotalVoteWeightUpdate)

    // 最新用户票龄 = 用户票龄 + 投票金额 *（当前高度 - 用户票龄更新高度）
    const latestUserVoteWeight = props.data.userLastVoteWeight + props.data.userNomination * (props.data.blockHeight - props.data.userLastVoteWeightUpdate)
    console.log('latestUserVoteWeightlatestUserVoteWeight', latestUserVoteWeight, props.data.userLastVoteWeight, props.data.userNomination, (props.data.blockHeight - props.data.userLastVoteWeightUpdate))

    if (latestUserVoteWeight > 0 && latestTotalVoteWeight > 0 && props.data.jackpot > 0) {
      // 用户待领利息 = 最新用户票龄 / 最新总票龄 * 奖池金额
      pendingInterest = latestUserVoteWeight / latestTotalVoteWeight * props.data.jackpot
    }
  }

  return (
    <View
      style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17 }}>{props.data.name || props.data.account}</Text>
          {props.data.userNomination !== '-' && (<Text style={{ fontSize: 15, color: '#888888' }}>已投: {formatBalance(props.data.userNomination, 4)} </Text>)}
          {props.data.userNomination !== '-' && (<Text style={{ fontSize: 15, color: '#888888' }}>待领：{ formatBalance(pendingInterest, 8) } </Text>)}
          {props.data.userNomination === '-' && (<Text style={{ fontSize: 15, color: '#888888' }}>已投: -</Text>)}
        </View>
        <Text style={{ fontSize: 17 }}>{ formatBalance(props.data.totalNomination, 4) }</Text>
      </View>
    </View>)
}

export default ChainXValidatorTableViewCell
