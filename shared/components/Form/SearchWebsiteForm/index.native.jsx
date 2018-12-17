import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { SearchContainer, SearchField } from 'components/Form'
import { LinkingRightButton, WebViewLeftButton } from 'components/NavigationBar'
import Colors from 'resources/colors'
import { SCREEN_WIDTH } from 'utils/dimens'
import Ionicons from 'react-native-vector-icons/Ionicons'

// import Ionicons from 'react-native-vector-icons/Ionicons'
// import messages from './messages'

@reduxForm({
  form: 'searchWebsiteForm'
})
@connect(state => ({
  locale: state.intl.get('locale')
}))
export default class SearchWebsiteForm extends Component {
  render() {
    const { onSubmitEditing } = this.props

    return (
      <View style={{ justifyContent: 'flex-start', width: SCREEN_WIDTH }}>
        <SearchContainer style={{ width: SCREEN_WIDTH - 150, justifyContent: 'flex-start' }}>
          <Field
            name="searchTerm"
            component={SearchField}
            placeholder="Search or enter website url"
            placeholderTextColor={Colors.textColor_181_181_181}
            numberOfLines={1}
            returnKeyType="go"
            onSubmitEditing={onSubmitEditing}
          />
        </SearchContainer>
        <View style={{ position: 'absolute', top: 0, right: 100 }}>
          <LinkingRightButton iconName="ios-more" onPress={this.props.showBrowserMenu} />
        </View>
      </View>
    )
  }
}
