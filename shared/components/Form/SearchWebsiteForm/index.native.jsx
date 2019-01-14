import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { SearchContainer, SearchField } from 'components/Form'
import Colors from 'resources/colors'
import { SCREEN_WIDTH } from 'utils/dimens'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import messages from './messages'

@reduxForm({
  form: 'searchWebsiteForm'
})

@connect(
  state => ({
    locale: state.intl.locale
  })
)

export default class SearchWebsiteForm extends Component {
  render() {
    const { onSubmitEditing } = this.props

    return (
      <SearchContainer style={{ width: SCREEN_WIDTH - 100 }}>
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
    )
  }
}
