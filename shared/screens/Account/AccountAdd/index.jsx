import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, ScrollView, LayoutAnimation } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Colors from 'resources/colors'
import { IntlProvider } from 'react-intl'
import NavigationBar, { CommonButton } from 'components/NavigationBar'
import secureStorage from 'utils/secureStorage'
import Dialog from 'components/Dialog'
import messages from 'resources/messages'
import * as eosAccountActions from 'actions/eosAccount'
import { GradiantCard, GradiantCardContainer } from 'components/GradiantCard'
import styles from './styles'
import UserAgreement from '../../Assets/UserAgreement'

@connect(
  state => ({
    locale: state.intl.get('locale'),
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...eosAccountActions
      },
      dispatch
    )
  }),
  null,
  { withRef: true }
)
export default class AccountAdd extends Component {
  static get options() {
    return {
      bottomTabs: {
        visible: false
      }
    }
  }

  state = {
    type: '',
    isVisible: false
  }

  UNSAFE_componentWillUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  dismissModal = () => {
    this.setState({ isVisible: false })
  }

  acceptUserAgreement = () => {
    const { type } = this.state
    let entrance = 'EOSAccountCreation'
    switch (type) {
      case 'import':
        entrance = 'AccountImport'
        break
      case 'create':
        entrance = 'EOSAccountCreation'
        break
      case 'assistance':
        entrance = 'AccountAssistance'
        break
      case 'contract':
        entrance = 'AccountSmartContact'
        break
      default:
        break
    }
    this.setState({ isVisible: false }, () => {
      Navigation.push(this.props.componentId, {
        component: {
          name: `BitPortal.${entrance}`
        }
      })
    })
  }

  showUserAgreement = async type => {
    // console.log('###--yy', type)
    const { locale } = this.props
    const eosAccountCreationRequestInfo = await secureStorage.getItem('EOS_ACCOUNT_CREATION_REQUEST_INFO', true)
    if (eosAccountCreationRequestInfo) {
      const { action } = await Dialog.alert(
        messages[locale].assets_popup_label_pending_create_order,
        messages[locale].assets_popup_text_pending_create_order,
        {
          negativeText: messages[locale].general_popup_button_cancel,
          positiveText: messages[locale].assets_popup_button_check_order
        }
      )
      if (action === Dialog.actionPositive) {
        const componentId = this.props.componentId
        this.props.actions.showAssistanceAccountInfo({ componentId })
      } else {
        return null
      }
    } else {
      this.setState({ isVisible: true, type })
    }
  }

  render() {
    const { locale } = this.props
    return (
      <IntlProvider messages={messages[locale]}>
        <View style={styles.container}>
          <NavigationBar 
            title={messages[locale].account_change_button_add_account}
            leftButton={<CommonButton iconName="md-arrow-back" onPress={() => Navigation.pop(this.props.componentId)} />}
          />
          <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
              <GradiantCardContainer
                containerTag={messages[locale].assets_label_create_account}
                extraStyle={{ marginTop: 10 }}
              >
                <GradiantCard
                  title={messages[locale].assets_label_create_account_registration_code}
                  extraStyle={{ marginBottom: 10 }}
                  onPress={() => this.showUserAgreement('create')}
                  content={messages[locale].assets_text_create_account_registration_code}
                />
                <GradiantCard
                  title={messages[locale].assets_label_create_account_friend_assistance}
                  extraStyle={{ marginBottom: 10 }}
                  onPress={() => this.showUserAgreement('assistance')}
                  content={messages[locale].assets_text_create_account_friend_assistance}
                />
                <GradiantCard
                  title={messages[locale].assets_label_create_account_smart_contract}
                  onPress={() => this.showUserAgreement('contract')}
                  content={messages[locale].assets_text_create_account_smart_contract}
                />
              </GradiantCardContainer>

              <GradiantCardContainer
                containerTag={messages[locale].assets_label_import_account}
                extraStyle={{ marginTop: 10 }}
              >
                <GradiantCard
                  title={messages[locale].assets_label_import_account_import_private_key}
                  colors={Colors.gradientCardColors2}
                  onPress={() => this.showUserAgreement('import')}
                  content={messages[locale].assets_text_import_account_import_private_key}
                />
              </GradiantCardContainer>
            </ScrollView>
          </View>
          <UserAgreement
            acceptUserAgreement={this.acceptUserAgreement}
            isVisible={this.state.isVisible}
            dismissModal={this.dismissModal}
          />
        </View>
      </IntlProvider>
    )
  }
}
