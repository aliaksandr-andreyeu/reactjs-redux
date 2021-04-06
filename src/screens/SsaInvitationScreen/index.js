import React, { Component } from 'react'
import { View, TextInput, FlatList } from 'react-native'
import propTypes from 'prop-types'
import ConfirmButtons from '../../components/UI/ConfirmButtons'
import ContactItem from './components/ContactItem'
import styles from './styles'
import { axiosInstance, apiUrls } from '../../constants/api'
import Loading from '../../components/Loading'
import i18n from '../../../i18n'

class SsaInviteContactScreen extends Component {
  state = {
    inputValue: '',
    selectedContacts: [],
    allContacts: [],
    contactsToRender: [],
    isLoading: true
  }

  componentDidMount() {
    const requests = [axiosInstance(apiUrls.getAccountDetails), axiosInstance(apiUrls.getUsers)]

    Promise.all(requests)
      .then(([accountDetailsResponse, usersResponse]) => {
        const userId = accountDetailsResponse.data.Id

        const sortedContacts = usersResponse.data.Items.filter(item => item.Id !== userId).sort((a, b) =>
          a.FullName.trim().localeCompare(b.FullName.trim())
        )

        this.setState({
          allContacts: sortedContacts,
          contactsToRender: sortedContacts,
          isLoading: false
        })
      })
      .catch(() =>
        this.setState({
          isLoading: false
        })
      )
  }

  handleSelection = id => {
    const { selectedContacts } = this.state
    let updatedContacts = [...selectedContacts]

    if (updatedContacts.includes(id)) {
      updatedContacts = updatedContacts.filter(itemId => itemId !== id)
    } else {
      updatedContacts.push(id)
    }

    this.setState(() => ({
      selectedContacts: updatedContacts
    }))
  }

  handleInputChange = text => {
    const { allContacts } = this.state
    let contactsToRender = allContacts

    const inputText = text.trim().toLowerCase()

    if (inputText) {
      contactsToRender = allContacts.filter(item => item.FullName.toLowerCase().includes(inputText))
    }

    this.setState({
      contactsToRender,
      inputValue: text
    })
  }

  inviteContacts = () => {
    const { selectedContacts } = this.state
    const { navigation } = this.props

    const eventId = navigation.getParam('id')

    if (eventId) {
      const params = {
        Id: eventId,
        Users: selectedContacts
      }

      if (selectedContacts.length) {
        axiosInstance.post(apiUrls.postInvite, params).then(res => console.log(res))
      }
    }
  }

  renderList = () => {
    const { selectedContacts, contactsToRender } = this.state

    return (
      <FlatList
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        data={contactsToRender}
        keyExtractor={item => item.Id}
        extraData={this.state}
        renderItem={({ item }) => (
          <ContactItem
            imageUrl={item.ImageThumbURL}
            fullName={item.FullName}
            handleSelection={() => this.handleSelection(item.Id)}
            selected={selectedContacts.includes(item.Id)}
          />
        )}
      />
    )
  }

  renderItem = item => {
    const { selectedContacts } = this.state

    return (
      <ContactItem
        imageUrl={item.ImageThumbURL}
        fullName={item.FullName}
        handleSelection={() => this.handleSelection(item.Id)}
        selected={selectedContacts.includes(item.Id)}
      />
    )
  }

  render() {
    const { inputValue, contactsToRender, isLoading } = this.state

    if (isLoading) {
      return <Loading />
    }

    return (
      <View style={styles.container}>
        <View style={styles.innerWrapper}>
          <View style={[styles.inputWrapper, styles.boxShadow]} elevation={5}>
            <TextInput
              value={inputValue}
              autoCompleteType="off"
              autoCorrect={false}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              onChangeText={this.handleInputChange}
              style={[styles.input]}
            />
          </View>
          {this.renderList(contactsToRender)}
        </View>
        <ConfirmButtons
          handleSave={this.inviteContacts}
          handleCancel={() => false}
          confirmLabel={i18n.t('generic.buttons.invite')}
          cancelLabel={i18n.t('generic.buttons.cancel')}
        />
      </View>
    )
  }
}

SsaInviteContactScreen.propTypes = {
  navigation: propTypes.shape({
    getParam: propTypes.func.isRequired
  }).isRequired
}

export default SsaInviteContactScreen
