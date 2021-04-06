import React, { Component } from 'react'
import { Alert, Text, TextInput, ScrollView, TouchableOpacity, View } from 'react-native'
import Global from '../../components/global'
import axios from 'axios'
import { axiosInstance, apiUrls, checkoutApi } from '../../constants/api'
import ConfirmButtons from '../../components/UI/ConfirmButtons'
import styles from './styles'
import i18n from '../../../i18n'
import { NavHeaderUser } from '../../components/NavHeaderUser'
import colors from '../../constants/colors'

export default class PaymentNameCheck extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      // title: i18n.t('payment.your_cart'),
      title: i18n.t('payment.checkout')
    }
  }

  state = {
    firstName: Global.user && Boolean(Global.user.firstName) ? Global.user.firstName.toString().trim() : '',
    lastName: Global.user && Boolean(Global.user.lastName) ? Global.user.lastName.toString().trim() : ''
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  saveName = () => {
    const { firstName, lastName } = this.state

    const params = {
      FirstName: firstName,
      LastName: lastName
    }

    // console.log('params', params)

    axiosInstance
      .post(apiUrls.accountUpdateName, params)
      .then(data => {
        // console.log('data', data.data)

        Global.user.firstName = firstName
        Global.user.lastName = lastName
        Global.user.name = `${firstName} ${lastName}`

        Global.user.FirstName = firstName
        Global.user.LastName = lastName
        Global.user.FullName = `${firstName} ${lastName}`

        this.props.navigation.navigate('Payment')
      })
      .catch(e => console.log(e))
  }

  handleSave = () => {
    const { firstName, lastName } = this.state

    let isFirstName = firstName ? firstName.toString().trim() : ''
    let isLastName = lastName ? lastName.toString().trim() : ''

    let isOk = Boolean(isFirstName) && Boolean(isLastName)

    if (isOk) {
      this.setState(
        {
          firstName: isFirstName,
          lastName: isLastName
        },
        () => {
          this.saveName()
        }
      )
    } else {
      Alert.alert(i18n.t('profile.specify_first_last_name'))
    }
  }

  render() {
    const { firstName, lastName } = this.state

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>{i18n.t('profile.specify_first_last_name')}</Text>

          <TextInput
            onChange={e => {
              let text = e && e.nativeEvent && e.nativeEvent.text ? e.nativeEvent.text : ''
              this.setState({
                firstName: text
              })
            }}
            value={firstName}
            style={{
              ...styles.searchFieldList,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
            }}
            placeholder={i18n.t('profile.first_name')}
            placeholderTextColor={'#8C9091'}
          />

          <TextInput
            onChange={e => {
              let text = e && e.nativeEvent && e.nativeEvent.text ? e.nativeEvent.text : ''
              this.setState({
                lastName: text
              })
            }}
            value={lastName}
            style={{
              ...styles.searchFieldList,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
            }}
            placeholder={i18n.t('profile.last_name')}
            placeholderTextColor={'#8C9091'}
          />
        </View>

        <ConfirmButtons
          closeOnApply={false}
          closeOnCancel={true}
          handleCancel={() => false}
          handleSave={() => this.handleSave()}
          cancelLabel={i18n.t('generic.buttons.back')}
          confirmLabel={i18n.t('generic.buttons.next')}
        />
      </ScrollView>
    )
  }
}
