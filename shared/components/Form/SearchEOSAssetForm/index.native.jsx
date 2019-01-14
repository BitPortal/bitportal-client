import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { SearchContainer, SearchField } from 'components/Form'
import Colors from 'resources/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import messages from './messages'

@reduxForm({
  form: 'searchEOSAssetForm'
})

@connect(
  state => ({
    locale: state.intl.locale
  })
)

export default class SearchEOSAssetForm extends Component {
  render() {
    const { locale } = this.props

    return (
      <SearchContainer>
        <Field
          name="searchTerm"
          component={SearchField}
          placeholder={messages[locale].search}
          placeholderTextColor={Colors.textColor_181_181_181}
          numberOfLines={1}
          leftContent={<Ionicons name="ios-search" size={24} color={Colors.textColor_181_181_181} style={{ paddingHorizontal: 10, paddingRight: 10 }} />}
        />
      </SearchContainer>
    )
  }
}
