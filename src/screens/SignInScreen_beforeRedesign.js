import React from 'react'
import {
  Image,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AppRegistry,
  TextInput,
  Alert,
  ImageBackground
} from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'

import { LinearGradient } from 'expo-linear-gradient'

import { LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'

import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin'
import i18n from '../../i18n'

import AuthBgImage from '../assets/images/auth-bg.png'
import { axiosInstance } from '../constants/api'
import { fontFamily } from '../constants/fonts'

import env from '../config'

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    email: '',
    password: ''
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
        email: '',
        country: 0,
        language: 0,
        phone: '',
        token: ''
      }
    } else {
      this.user = JSON.parse(storedValue)
    }

    signupUser = this.props.navigation.getParam('object', {})
    if (signupUser && signupUser.email) {
      this.setState({ email: signupUser.email })
    }
    if (signupUser && signupUser.password) {
      this.setState({ password: signupUser.password })
    }

    GoogleSignin.configure({
      // It is mandatory to call this method before attempting to call signIn()
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '970814518409-4vl92cmc481k2kvegevsdmnju9q62ofl.apps.googleusercontent.com'
    })
  }

  _authGoogle = async () => {
    // Prompts a modal to let the user sign in into your application.
    try {
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed.
        // Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true
      })
      const userInfo = await GoogleSignin.signIn()

      // alert(JSON.stringify(userInfo));

      console.log('User Info --> ', userInfo)

      this._externalSignIn('Google', userInfo.user.id, userInfo.idToken)
    } catch (error) {
      console.log('Message', error.message)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated')
      } else {
        console.log('Some Other Error Happened')
      }
    }
  }

  _getCurrentUser = async () => {
    // May be called eg. in the componentDidMount of your main component.
    // This method returns the current user
    // if they already signed in and null otherwise.
    try {
      const userInfo = await GoogleSignin.signInSilently()
      this.setState({ userInfo })
    } catch (error) {
      console.log(error)
    }
  }

  _signOut = async () => {
    // Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()
      this.setState({ user: null }) // Remove the user from your app's state as well
    } catch (error) {
      console.log(error)
    }
  }

  _revokeAccess = async () => {
    // Remove your application from the user authorized applications.
    try {
      await GoogleSignin.revokeAccess()
      console.log('deleted')
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <ImageBackground source={AuthBgImage} style={{ width: '100%', height: '100%' }}>
        <View style={{ flex: 1, paddingTop: 30 }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flex: 4 }} />
            <View style={{ flex: 6 }}>
              <Text
                style={{
                  fontFamily: fontFamily.gothamBold,
                  fontSize: 18,
                  color: '#6D6E71',
                  alignSelf: 'center',
                  marginBottom: 15
                }}
              >
                Sign In
              </Text>

              <TextInput
                autocomplete="email"
                keyboardType="email-address"
                placeholder={i18n.t('signup.email')}
                color="#000000"
                placeholderTextColor="#6D6E71"
                style={styles.input}
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
              />

              <TextInput
                placeholder={i18n.t('signup.password')}
                placeholderTextColor="#6D6E71"
                secureTextEntry
                style={styles.input}
                value={this.state.password}
                onChangeText={text => this.setState({ password: text })}
              />

              <Text
                style={{
                  fontFamily: fontFamily.gothamMedium,
                  fontSize: 10,
                  color: '#6D6E71',
                  textAlign: 'center',
                  marginLeft: 120,
                  marginBottom: 15,
                  marginTop: -5
                }}
                onPress={() => {
                  this.props.navigation.navigate('RecoverPassword', {})
                }}
              >
                {i18n.t('signin.forgot_password')}
              </Text>

              <TouchableOpacity onPress={this._signIn} style={styles.authButton}>
                <Text style={{ fontFamily: fontFamily.gothamMedium, fontSize: 14, color: '#F7F7F7' }}>
                  {i18n.t('signin.sign_in')}
                </Text>
              </TouchableOpacity>

              <View style={{ marginBottom: 16, marginTop: -15 }}>
                <Text
                  style={{
                    fontFamily: fontFamily.gothamMedium,
                    fontSize: 10,
                    color: '#6D6E71',
                    alignSelf: 'center'
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('SignUp', {})
                  }}
                >
                  {i18n.t('signup.not_yet_registered')}
                  <Text
                    style={{
                      fontFamily: fontFamily.gothamBold,
                      textDecorationLine: 'underline',
                      textDecorationStyle: 'solid'
                    }}
                  >
                    {' '}
                    {i18n.t('signup.register_now')}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Home', {})
                }}
                style={styles.askMeLaterButton}
              >
                <Text
                  style={{
                    fontFamily: 'Helvetica Neue',
                    fontWeight: 'bold',
                    fontSize: 10,
                    color: '#6D6E71'
                  }}
                >
                  {i18n.t('signin.skip_sign_in')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            flex: 1,
            flexDirection: 'row',
            shadowRadius: 1,
            shadowOffset: { width: 0, height: -2 },
            shadowColor: '#c1c1c1',
            elevation: 1,
            shadowOpacity: 0.7
          }}
        >
          <LinearGradient colors={['#3ea4d3', '#1d4296']} style={{ flex: 1 }} start={[0, 0]} end={[1, 1]}>
            <TouchableOpacity onPress={this._authFacebook}>
              <View style={{ flex: 5, padding: 16, textAlign: 'center' }}>
                <Text
                  style={{
                    fontFamily: 'Arial',
                    fontSize: 20,
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  facebook
                </Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient colors={['#e66362', '#bc3a57']} style={{ flex: 1 }} start={[0, 0]} end={[1, 1]}>
            <TouchableOpacity onPress={this._authGoogle}>
              <View style={{ flex: 5, padding: 16, textAlign: 'center' }}>
                <Text
                  style={{
                    fontFamily: 'Arial',
                    fontSize: 20,
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  Google+
                </Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ImageBackground>
    )
  }

  _authFacebook = () => {
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          // alert("Login cancelled");
        } else {
          // array result.grantedPermissions

          AccessToken.getCurrentAccessToken().then(data => {
            this._externalSignIn('Facebook', data.userID, data.accessToken)

            // this._loadFbUser(data);
          })
        }
      },
      error => {
        alert(`Login fail with error: ${error}`)
      }
    )
  }

  _loadFbUser = data => {
    headers = { Accept: 'application/json', 'Content-Type': 'application/json' }

    fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${data.accessToken}`, {
      method: 'GET',
      headers
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson) {
          // .id, .name., .email
          alert(responseJson.name)
        }
      })
  }

  _externalSignIn = (provider, key, token) => {
    headers = { Accept: 'application/json', 'Content-Type': 'application/json' }
    // if (this.user.token && this.user.token.length > 4) headers['auth-token'] = this.user.token;

    const body = JSON.stringify({
      Provider: provider,
      ProviderKey: key,
      ExternalAccessToken: token
    })

    // alert(body);
    console.log(body)

    fetch(`${env.api}api/account/external/signin`, {
      method: 'POST',
      headers,
      body
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        if (responseJson.Token) {
          this.user.token = responseJson.Token
          this.user.name = responseJson.SignedInUser.FullName
          this.user.email = responseJson.SignedInUser.Email
          this.user.country = responseJson.SignedInUser.CountryId
          this.user.language = responseJson.SignedInUser.LanguageId
          this.user.phone = responseJson.SignedInUser.Phone
          this.user.image = responseJson.SignedInUser.ImageThumbURL

          AsyncStorage.setItem('app:user', JSON.stringify(this.user))

          this.props.navigation.navigate('Home')
        } else {
          Alert.alert(responseJson.Message)
        }
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

  _signIn = () => {
    headers = { Accept: 'application/json', 'Content-Type': 'application/json' }
    if (this.user.token && this.user.token.length > 4) {
      headers['auth-token'] = this.user.token
    }

    console.log(this.state.email)
    console.log(this.state.password)

    axiosInstance
      .post(`${env.api}api/account/signin`, {
        Email: this.state.email,
        Password: this.state.password
      })
      .then(({ data }) => {
        if (data.Token) {
          this.user.token = data.Token
          this.user.name = data.SignedInUser.FullName
          this.user.email = data.SignedInUser.Email
          this.user.country = data.SignedInUser.CountryId
          this.user.language = data.SignedInUser.LanguageId
          this.user.phone = data.SignedInUser.Phone
          this.user.image = data.SignedInUser.ImageThumbURL

          AsyncStorage.setItem('app:user', JSON.stringify(this.user))

          this.props.navigation.navigate('Home')
        } else {
          Alert.alert(data.Message)
        }
      })
      .catch(err => console.log(err))
  }

  _signUpFacebook = () => {
    console.log(this.state)

    this.props.navigation.navigate('Home')
  }

  _signUpGoogle = () => {
    console.log(this.state)

    this.props.navigation.navigate('Home')
  }
}

const styles = StyleSheet.create({
  askMeLaterButton: {
    padding: 7,
    // borderWidth: 2,
    // borderColor: '#2F8C83',
    borderWidth: 1,
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: '#6d6e71',
    borderRadius: 90,
    paddingLeft: 10,
    paddingRight: 10,
    width: 100
  },
  authButton: {
    padding: 8,
    backgroundColor: '#06a09a',
    alignItems: 'center',
    alignSelf: 'center',
    // backgroundColor: '#06a09a',
    borderRadius: 60,
    opacity: 0.6,
    paddingLeft: 25,
    paddingRight: 25,
    width: 120,
    marginBottom: 25
  },
  container: {
    flex: 1,
    //    backgroundColor: '#fff',
    alignItems: 'center'
  },
  contentContainer: {
    paddingTop: 30
  },
  developmentModeText: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    padding: 10,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: '#6d6e71',
    // backgroundColor: '#06a09a',
    borderRadius: 60,
    opacity: 0.6,
    width: 235,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 12,
    color: '#000000',
    fontSize: 14,
    fontFamily: fontFamily.gothamMedium
  }
})
