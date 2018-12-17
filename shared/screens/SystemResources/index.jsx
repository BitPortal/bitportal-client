import * as React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import { Navigation } from 'react-native-navigation'
import SystemResource from 'screens/Market/SystemResources'
import messages from 'resources/messages'
import styles from './styles'

@connect(
  state => ({
    locale: state.intl.get('locale')
  }),
  null,
  null,
  { withRef: true }
)

export default class SystemResources extends React.Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  render() {
    const { locale, componentId } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar
            title={"SystemResources"}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <SystemResource componentId={componentId} />
          </View>
        </View>
      </IntlProvider>
    )
  }
}
