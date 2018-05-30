/* eslint-disable react/no-array-index-key */
import React from 'react'
import { View, ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import { styles } from './style'

class CardSilder extends React.PureComponent{
  constructor(props){
    super(props)
    this.state = {
      numOfCards: this.props.children.length,
      position: 1,
    }
    this.autoMove = true
    this.timer = null
  }

  componentDidMount() {
    this.startInterval()
  }

  componentWillUnmount(){
    this.timer && clearInterval(this.timer)
  }

  startInterval = () => {
    const { autoplay, playInterval } = this.props
    this.autoMove = true
    if (autoplay) {
      this.timer = setInterval(() => {
        this.next()
      }, playInterval)
    }
  }

  next = () => {
    if (this.autoMove) {
      this.slider.scrollTo({ x: (window.width - 30) * this.state.position })
    }
  }

  onScroll = (event) => {
    this.autoMove = false
    const offsetX = event.nativeEvent.contentOffset.x
    const page = parseInt(offsetX / (window.width - 30), 10)

    if (page === this.state.numOfCards - 1) {
      this.setState({ position: 0 })
    } else {
      this.setState({ position: page + 1 })
    }

    setTimeout(() => {
      this.autoMove = true
    }, 1000)
  }

  render() {
    return (
      <View style={{ height: 180 }}>
        <ScrollView
          {...this.props}
          ref={(i) => { this.slider = i }}
          style={[styles.scroll, this.props.style]}
          onScroll={this.onScroll}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={20}
        >
          {
            this.props.children.map((item, index) =>
              <View style={styles.card} key={index}>
                {item}
              </View>)
          }
        </ScrollView>
      </View>
    )
  }
}

CardSilder.propTypes = {
  playInterval: PropTypes.number,
  autoplay: PropTypes.bool,
}

CardSilder.defaultProps = {
  playInterval: 3000,
  autoplay: true,
}

export default CardSilder
