import React, { Component } from 'react';

import { ScrollView, Alert, TouchableOpacity, Text, View, TextInput } from 'react-native';

import axios from 'axios';

import env from '../../config';

import { NavHeaderUser } from '../../components/NavHeaderUser';

import Accordion from './components/Accordion';

import { axiosInstance, apiUrls } from '../../constants/api';

import styles from './styles';

import i18n from '../../../i18n';

import isEqual from 'lodash.isequal';

const requestType = [
  {
    id: 'contactUs.refund',
    value: 'Refund',
  },
  {
    id: 'contactUs.enquiries',
    value: 'Enquiries',
  },
  {
    id: 'contactUs.events_venues',
    value: 'EventsAndVenues',
  },
  {
    id: 'contactUs.marketing',
    value: 'Marketing',
  },
];

export default class ContactUs extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('contactUs.title'),
    };
  };

  state = {
    faq: [],
    firstName: '',
    lastName: '',
    email: '',
    bookingReference: '',
    contactUsRequestType: i18n.t(requestType[0].id),
    contactUsRequestTypeId: requestType[0].value,
    message: '',
  };

  componentDidMount() {
    this.getFaq();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props, prevProps)) {
      this.getFaq();
    }
  }

  getFaq() {
    axiosInstance
      .get(`${apiUrls.getFaq}?langCode=${i18n.locale.toUpperCase()}`)
      .then(({ data }) => {
        if (data && data.Data && data.Data.length > 0) {
          this.setState({
            faq: data.Data,
          });
        }
      })
      .catch(e => console.log('Error at ' + apiUrls.getFaq + ': ' + e));
  }

  sendContactForm() {
    const {
      firstName,
      lastName,
      email,
      bookingReference,
      contactUsRequestTypeId,
      message,
    } = this.state;

    let model = {
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      BookingReference: bookingReference,
      ContactUsRequestType: contactUsRequestTypeId,
      Message: message,
    };

    axiosInstance
      .post(`${apiUrls.postContactForm}?langCode=${i18n.locale.toUpperCase()}`, model)
      .then(({ data }) => {
        if (data && data.Message) {
          Alert.alert(i18n.t('contactUs.contactForm'), data.Message);
        }
      })
      .catch(e => console.log('Error at ' + apiUrls.postContactForm + ': ' + e));
  }

  applyRequestType(item) {
    console.log('applyRequestType', item);

    if (item && item.length > 0) {
      let value = item[0];

      let arr = requestType.filter((item, i) => item.value === value);

      this.setState({
        contactUsRequestType: arr && arr.length > 0 ? i18n.t(arr[0].id) : i18n.t(requestType[0].id),
        contactUsRequestTypeId: value,
      });
    } else {
      this.setState({
        contactUsRequestType: i18n.t(requestType[0].id),
        contactUsRequestTypeId: requestType[0].value,
      });
    }
  }

  render() {
    const {
      faq,
      firstName,
      lastName,
      email,
      bookingReference,
      contactUsRequestType,
      contactUsRequestTypeId,
      message,
    } = this.state;
    const { navigation } = this.props;

    // console.log( 'faq', faq );

    return (
      <ScrollView>
        <View style={styles.box}>
          <Text
            style={{
              ...styles.title,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('contactUs.faq')}
          </Text>

          <Accordion faq={faq} />

          <Text
            style={{
              ...styles.title,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('contactUs.title')}
          </Text>

          <Text
            style={{
              ...styles.subTitle,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('contactUs.first_name')}
          </Text>
          <TextInput
            placeholder={i18n.t('contactUs.first_name')}
            placeholderTextColor="#8C9091"
            returnKeyType="go"
            style={{
              ...styles.input,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
            onChange={e => {
              let value = e && e.nativeEvent && e.nativeEvent.text ? e.nativeEvent.text : '';
              this.setState({
                firstName: value,
              });
            }}
            value={firstName}
          />

          <Text
            style={{
              ...styles.subTitle,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('contactUs.last_name')}
          </Text>
          <TextInput
            placeholder={i18n.t('contactUs.last_name')}
            placeholderTextColor="#8C9091"
            returnKeyType="go"
            style={{
              ...styles.input,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
            onChange={e => {
              let value = e && e.nativeEvent && e.nativeEvent.text ? e.nativeEvent.text : '';
              this.setState({
                lastName: value,
              });
            }}
            value={lastName}
          />

          <Text
            style={{
              ...styles.subTitle,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('contactUs.email')}
          </Text>
          <TextInput
            placeholder={i18n.t('contactUs.email')}
            placeholderTextColor="#8C9091"
            returnKeyType="go"
            style={{
              ...styles.input,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
            onChange={e => {
              let value = e && e.nativeEvent && e.nativeEvent.text ? e.nativeEvent.text : '';
              this.setState({
                email: value,
              });
            }}
            value={email}
          />

          <Text
            style={{
              ...styles.subTitle,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('contactUs.booking_reference')}
          </Text>
          <TextInput
            placeholder={i18n.t('contactUs.booking_reference')}
            placeholderTextColor="#8C9091"
            returnKeyType="go"
            style={{
              ...styles.input,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
            onChange={e => {
              let value = e && e.nativeEvent && e.nativeEvent.text ? e.nativeEvent.text : '';
              this.setState({
                bookingReference: value,
              });
            }}
            value={bookingReference}
          />

          <Text
            style={{
              ...styles.subTitle,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('contactUs.request_type')}
          </Text>
          <TouchableOpacity
            style={styles.dropdownBox}
            activeOpacity={0.9}
            onPress={() => {
              navigation.navigate('RadioFilterScreen', {
                onApply: value => this.applyRequestType(value),
                isContactUs: true,
                defaultValue: requestType[0].value,
                selectedItems: [contactUsRequestTypeId],
                items: [
                  {
                    id: requestType[0].value,
                    label: i18n.t(requestType[0].id),
                  },
                  {
                    id: requestType[1].value,
                    label: i18n.t(requestType[1].id),
                  },
                  {
                    id: requestType[2].value,
                    label: i18n.t(requestType[2].id),
                  },
                  {
                    id: requestType[3].value,
                    label: i18n.t(requestType[3].id),
                  },
                ],
                screenTitle: i18n.t('contactUs.request_type'),
              });
            }}
          >
            <View style={styles.dropdown}>
              <Text
                style={{
                  ...styles.dropdownText,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                }}
              >
                {contactUsRequestType}
              </Text>
            </View>
          </TouchableOpacity>

          <Text
            style={{
              ...styles.subTitle,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('contactUs.message')}
          </Text>
          <TextInput
            multiline={true}
            numberOfLines={6}
            placeholder={i18n.t('contactUs.message')}
            placeholderTextColor="#8C9091"
            returnKeyType="go"
            style={{
              ...styles.textareaBox,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
            onChange={e => {
              let value = e && e.nativeEvent && e.nativeEvent.text ? e.nativeEvent.text : '';
              this.setState({
                message: value,
              });
            }}
            value={message}
          />

          <TouchableOpacity
            style={styles.btnBox}
            onPress={() => {
              this.sendContactForm();
            }}
          >
            <View style={styles.btn}>
              <Text style={styles.btnText}>{i18n.t('contactUs.send')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
