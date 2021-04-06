import React from 'react'
import {
  Image,
  Button,
  Platform,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AppRegistry,
  TextInput,
  Alert,
  ImageBackground,
  SafeAreaView,
  Modal
} from 'react-native'

import axios from 'axios'

import moment from 'moment'

import AsyncStorage from '@react-native-community/async-storage'
import ImagePicker from 'react-native-image-crop-picker'

import RNPickerSelect from 'react-native-picker-select'
import DateTimePicker from '@react-native-community/datetimepicker'

import { LinearGradient } from 'expo-linear-gradient'

import Global from '../components/global'

import env from '../config'

import { LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'

import i18n from '../../i18n'

import { axiosInstance } from '../constants/api'
import { fontFamily } from '../constants/fonts'
import Icon from '../components/Icon'
import colors from '../constants/colors'

export default class EditProfileScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    form: {},
    showDatePicker: false
  }

  user = {}

  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    const storedValue = await AsyncStorage.getItem('app:user')
    if (storedValue == null) {
      this.user = {
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        country: 0,
        language: 0,
        phone: '',
        token: ''
      }

      this.loadProfile()
    } else {
      this.user = JSON.parse(storedValue)

      this.loadProfile()
    }
  }

  loadProfile() {
    let headers = { Accept: 'application/json', 'Content-Type': 'application/json' }

    if (this.user.token && this.user.token.length > 4) {
      headers.Authorization = 'Bearer  ' + this.user.token
    }

    fetch(`${env.api}api/account/details`, {
      method: 'GET',
      headers
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log('resp', responseJson.Message);
        if (responseJson.Message) {
          Alert.alert(responseJson.Message)
          return
        }

        if (responseJson) {
          // console.log('responseJson', responseJson);

          this.setState(
            {
              form: responseJson
            },
            () => {
              Global.user.firstName = responseJson.FirstName
              Global.user.lastName = responseJson.LastName
              Global.user.name = responseJson.FullName
              Global.user.avatar = responseJson.ImageThumbURL
            }
          )
        }
      })
  }

  loadAvatar() {
    let headers = { Accept: 'application/json', 'Content-Type': 'application/json' }

    if (this.user.token && this.user.token.length > 4) {
      headers.Authorization = 'Bearer  ' + this.user.token
    }

    fetch(`${env.api}api/account/details`, {
      method: 'GET',
      headers
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log('resp', responseJson.Message);
        if (responseJson.Message) {
          Alert.alert(responseJson.Message)
          return
        }

        if (responseJson) {
          this.setState(
            {
              form: {
                ...this.state.form,
                ImageURL: responseJson.ImageURL,
                ImageThumbURL: responseJson.ImageThumbURL
              }
            },
            () => {
              Global.user.avatar = responseJson.ImageThumbURL
            }
          )
        }
      })
  }

  save() {
    // alert(JSON.stringify(this.state.form));

    let headers = { Accept: 'application/json', 'Content-Type': 'application/json' }
    if (this.user.token && this.user.token.length > 4) {
      headers.Authorization = 'Bearer  ' + this.user.token
    }

    let payload = {
      ...this.state.form,
      IsMale: this.state.form.Gender === 'Male' ? true : false
    }

    // console.log('PAYLOAD', payload);

    const body = JSON.stringify(payload)

    fetch(`${env.api}api/account/update-details`, {
      method: 'POST',
      headers,
      body
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);

        this.loadProfile()

        Global.user.name = payload.FullName
        Global.user.avatar = payload.ImageThumbURL

        // console.log('PROFILE Global.user', Global.user);

        this.props.navigation.navigate('More', {})
      })
      .catch(error => {
        console.log('error', error)
        if (error && error.Message) {
          Alert.alert(error.Message)
        } else {
          Alert.alert(error)
        }
      })
  }

  uploadImage(image) {
    const form = new FormData()

    form.append('image', {
      name: 'image.jpg',
      type: 'multipart/form-data',
      uri: Platform.OS === 'android' ? image.path : image.path.replace('file:/', '')
    })

    axios
      .create({
        timeout: 10000,
        headers: {
          Authorization: 'Bearer  ' + this.user.token
        }
      })
      .post(`${env.api}api/account/update-photo`, form)
      .then(({ data }) => {
        this.loadAvatar()

        this.props.navigation.navigate('EditProfile', {})
      })
      .catch(error => {
        console.log('error', error)
        if (error && error.Message) {
          Alert.alert(error.Message)
        } else {
          Alert.alert(error)
        }
      })
  }

  selectPhoto = async () => {
    if (ImagePicker) {
      ImagePicker.openPicker({
        width: 500,
        height: 500,
        cropping: true
      }).then(image => {
        image.uri = image.path

        this.uploadImage(image)
      })
    } else {
      alert("Can't select photo: null;")
    }
  }

  closeDatePicker() {
    this.setState({
      showDatePicker: false
    })
  }

  renderDatePicker() {
    let isIOS = Platform.OS === 'ios'

    return (
      <DateTimePicker
        style={{
          ...(isIOS && {
            position: 'absolute',
            width: '100%',
            backgroundColor: '#ffffff',
            bottom: 0,
            left: 0,
            right: 0
          })
        }}
        textColor={colors.basicText}
        mode="date"
        display="calendar"
        onChange={(event, date) => {
          // console.log(event, date)
          console.log(date)
          // console.log( moment( date ).format('YYYY-MM-DDTHH:mm:ss'))
          if (date) {
            this.setState(
              prevState => {
                let form = Object.assign({}, prevState.form)
                form.DateOfBirth = moment(date).format('YYYY-MM-DDTHH:mm:ss')
                return {
                  form: form,
                  showDatePicker: false
                }
              },
              () => {}
            )
          }
        }}
        value={
          !this.state.form.DateOfBirth || Boolean(this.state.form.DateOfBirth === '1900-01-01T00:00:00')
            ? new Date('1980-01-01T00:00:00')
            : new Date(this.state.form.DateOfBirth)
        }
      />
    )
  }

  render() {
    // console.log('this.state.form', this.state.form);

    let isIOS = Platform.OS === 'ios'

    return (
      <View
        style={{
          backgroundColor: '#1b377e',
          flex: 1
        }}
      >
        <View style={styles.authHeader}>
          <SafeAreaView>
            <View
              style={styles.authInHeader}
              // onLayout={event => console.log('authHeader', event.nativeEvent.layout.height)}
            >
              <TouchableOpacity
                style={{ flexDirection: 'row', width: '100%' }}
                onPress={() => {
                  this.props.navigation.navigate('More', {})
                }}
              >
                {Icon.getIcon(Icon.iconLibraries.fontAwesome, 'chevron-left', {
                  size: 18,
                  color: '#FFFFFF'
                })}

                <Text style={[styles.headerTitle, { marginLeft: 28 }]}>{i18n.t('profile.complete_profile')}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        <ScrollView>
          <View
            style={{
              padding: 16,
              paddingTop: 32,
              width: '100%',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <TouchableOpacity
              style={{
                width: 88,
                height: 88,
                backgroundColor: '#00B5DF',
                borderColor: '#FFFFFF',
                borderWidth: 2,
                borderRadius: 255,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
              onPress={this.selectPhoto}
            >
              {(!this.state.form.ImageURL || this.state.form.ImageURL.length < 5) &&
                Icon.getIcon(Icon.iconLibraries.fontAwesome, 'camera', {
                  size: 38,
                  color: '#FFFFFF'
                })}
              {this.state.form.ImageURL && this.state.form.ImageURL.length > 5 && (
                <Image
                  source={{ uri: this.state.form.ImageURL }}
                  style={{ width: 88, height: 88 }}
                  resizeMode={'cover'}
                />
              )}
            </TouchableOpacity>

            <Text style={[styles.addPhoto, { marginBottom: 20 }]}>{i18n.t('profile.add_photo')}</Text>

            <TextInput
              onChangeText={text =>
                this.setState(
                  prevState => {
                    let form = Object.assign({}, prevState.form)
                    form.FullName = text
                    return { form }
                  },
                  () => {}
                )
              }
              value={this.state.form.FullName}
              style={{
                ...styles.input,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
              }}
              placeholder={i18n.t('profile.fullname')}
              placeholderTextColor={'#8C9091'}
            />

            <View
              style={{
                backgroundColor: '#EEEFEF',
                borderRadius: 4,
                marginTop: 16,

                width: '100%',
                height: 40
              }}
            >
              <TouchableOpacity
                style={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingLeft: 16,
                  paddingRight: 16,

                  width: '100%',
                  height: 40,
                  justifyContent: 'center'
                }}
                onPress={() => {
                  this.setState({
                    showDatePicker: true
                  })
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamily.gothamMedium,
                    fontSize: 14,
                    color: '#8C9091',
                    lineHeight: 26,
                    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                  }}
                >
                  {!this.state.form.DateOfBirth || Boolean(this.state.form.DateOfBirth === '1900-01-01T00:00:00')
                    ? moment('1980-01-01T00:00:00').format('D MMM YYYY')
                    : moment(this.state.form.DateOfBirth).format('D MMM YYYY')}
                </Text>
              </TouchableOpacity>
            </View>

            {isIOS ? (
              <Modal
                transparent={true}
                animationType="fade"
                visible={this.state.showDatePicker}
                // visible={true}
                onRequestClose={() => this.closeDatePicker()}
                onDismiss={() => this.closeDatePicker()}
              >
                <TouchableOpacity
                  style={{
                    //borderWidth: 1,
                    //borderColor: '#ff0000',
                    flex: 1
                  }}
                  activeOpacity={1}
                  onPress={() => {
                    this.closeDatePicker()
                  }}
                >
                  {this.renderDatePicker()}
                </TouchableOpacity>
              </Modal>
            ) : this.state.showDatePicker ? (
              this.renderDatePicker()
            ) : null}

            <TextInput
              keyboardType={'numeric'}
              onChangeText={text =>
                this.setState(
                  prevState => {
                    let form = Object.assign({}, prevState.form)
                    form.PhoneNumber = text
                    return { form }
                  },
                  () => {}
                )
              }
              value={this.state.form.PhoneNumber}
              style={{
                ...styles.input,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
              }}
              placeholder={i18n.t('profile.phoneNumber')}
              placeholderTextColor={'#8C9091'}
            />

            <View
              style={{
                backgroundColor: '#EEEFEF',
                borderRadius: 4,
                marginTop: 16,
                paddingLeft: 16,
                paddingRight: 16,
                width: '100%',
                height: 40,
                justifyContent: 'center'
              }}
            >
              <RNPickerSelect
                Icon={() =>
                  Icon.getIcon(Icon.iconLibraries.fontAwesome, 'caret-down', {
                    size: 20,
                    color: '#8C9091'
                  })
                }
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                style={{
                  placeholder: {
                    fontFamily: fontFamily.gothamMedium,
                    fontSize: 14,
                    color: '#8C9091',
                    lineHeight: 26,
                    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                  },
                  inputIOSContainer: {
                    alignItems: 'center',
                    flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse'
                  },
                  inputAndroidContainer: {
                    alignItems: 'center',
                    flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse'
                  },
                  inputIOS: {
                    padding: 0,
                    fontFamily: fontFamily.gothamMedium,
                    fontSize: 14,
                    color: '#8C9091',
                    lineHeight: 26,
                    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                  },
                  inputAndroid: {
                    padding: 0,
                    fontFamily: fontFamily.gothamMedium,
                    fontSize: 14,
                    color: '#8C9091',
                    lineHeight: 26,
                    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                  }
                }}
                onValueChange={value => {
                  this.setState(
                    prevState => {
                      let form = Object.assign({}, prevState.form)
                      form.Gender = value
                      return { form }
                    },
                    () => {}
                  )
                }}
                value={this.state.form.Gender ? this.state.form.Gender : ''}
                items={[
                  { label: i18n.t('profile.gender_male'), value: i18n.t('profile.gender_male') },
                  {
                    label: i18n.t('profile.gender_femalе'),
                    value: i18n.t('profile.gender_femalе')
                  }
                ]}
              />
            </View>

            <TextInput
              keyboardType={'numeric'}
              onChangeText={text =>
                this.setState(
                  prevState => {
                    let form = Object.assign({}, prevState.form)
                    form.Weight = +text
                    return { form }
                  },
                  () => {}
                )
              }
              value={this.state.form.Weight ? this.state.form.Weight.toString() : ''}
              style={{
                ...styles.input,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
              }}
              placeholder={i18n.t('profile.weight')}
              placeholderTextColor={'#8C9091'}
            />

            <TextInput
              keyboardType={'numeric'}
              onChangeText={text =>
                this.setState(
                  prevState => {
                    let form = Object.assign({}, prevState.form)
                    form.Height = +text
                    return { form }
                  },
                  () => {}
                )
              }
              value={this.state.form.Height ? this.state.form.Height.toString() : ''}
              style={{
                ...styles.input,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
              }}
              placeholder={i18n.t('profile.height')}
              placeholderTextColor={'#8C9091'}
            />

            {/*
            <TextInput
              onChangeText={text =>
                this.setState(
                  prevState => {
                    let form = Object.assign({}, prevState.form);
                    form.Occupation = text;
                    return { form };
                  },
                  () => {}
                )
              }
              value={this.state.form.Occupation}
              style={styles.input}
              placeholder={i18n.t('profile.occupation')}
              placeholderTextColor={'#8C9091'}
            />
            */}

            <TextInput
              onChangeText={text =>
                this.setState(
                  prevState => {
                    let form = Object.assign({}, prevState.form)
                    form.Nationality = text
                    return { form }
                  },
                  () => {}
                )
              }
              value={this.state.form.Nationality}
              style={{
                ...styles.input,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
              }}
              placeholder={i18n.t('profile.nationality')}
              placeholderTextColor={'#8C9091'}
            />

            <TextInput
              onChangeText={text =>
                this.setState(
                  prevState => {
                    let form = Object.assign({}, prevState.form)
                    form.City = text
                    return { form }
                  },
                  () => {}
                )
              }
              value={this.state.form.City}
              style={{
                ...styles.input,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
              }}
              placeholder={i18n.t('profile.residence')}
              placeholderTextColor={'#8C9091'}
            />
          </View>

          <View style={{ padding: 16, paddingBottom: 20, paddingTop: 30, width: '100%' }}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                this.save()
              }}
            >
              <Text style={styles.loginButtonText}>{i18n.t('profile.save')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  addPhoto: {
    color: '#FFFFFF',
    fontFamily: fontFamily.gothamMedium,
    fontSize: 12,
    textTransform: 'uppercase',
    marginTop: 12
  },
  input: {
    backgroundColor: '#EEEFEF',
    borderRadius: 4,
    marginTop: 16,

    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 16,
    paddingRight: 16,

    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
    width: '100%',
    height: 40,

    fontFamily: fontFamily.gothamMedium,
    fontSize: 14,
    color: '#8C9091',
    lineHeight: 26,

    justifyContent: 'center'
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#8C9091',
    borderRadius: 4,
    padding: 15,
    textAlign: 'center',
    alignItems: 'center'
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.gothamMedium,
    textAlign: 'center',
    alignItems: 'center'
  },
  authHeader: {
    backgroundColor: '#202873'
  },
  authInHeader: {
    paddingTop: 22,
    paddingBottom: 22,
    paddingLeft: 16,
    paddingRight: 16,
    minHeight: 62,
    justifyContent: 'center'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fontFamily.gothamMedium
  }
})
