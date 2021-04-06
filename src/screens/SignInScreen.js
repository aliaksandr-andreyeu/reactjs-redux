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
  ImageBackground,
  StatusBar
} from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'

import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication'

import { LinearGradient } from 'expo-linear-gradient'

import { LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'

import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin'
import i18n from '../../i18n'

import SigninBgImage from '../assets/images/signInBg.jpg'
import { axiosInstance } from '../constants/api'
import { fontFamily } from '../constants/fonts'
import Icon from '../components/Icon'
import colors from '../constants/colors'
import Global from '../components/global'
import WelcomeBgImage from '../assets/images/LanguageBg.png'

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
        firstName: '',
        lastName: '',
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
      scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
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
    let isIOS = Platform.OS === 'ios'

    return (
      <ImageBackground source={SigninBgImage} style={{ width: '100%', height: '100%' }}>
        <View style={styles.authHeader}>
          <TouchableOpacity
            style={{ flexDirection: 'row', width: '100%' }}
            onPress={() => {
              this.props.navigation.navigate('AuthChoice', {})
            }}
          >
            {Icon.getIcon(Icon.iconLibraries.fontAwesome, 'chevron-left', {
              size: 18,
              color: '#FFFFFF'
            })}

            <Text style={[styles.headerTitle, { marginLeft: 28 }]}>{i18n.t('signin.login')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View style={{ padding: 16, paddingTop: 32, paddingBottom: 0 }}>
            <TextInput
              autocomplete="email"
              keyboardType="email-address"
              onChangeText={text => this.setState({ email: text })}
              value={this.state.email}
              style={styles.input}
              placeholder={i18n.t('signin.email_address')}
              placeholderTextColor={'#8C9091'}
            />

            <TextInput
              secureTextEntry
              onChangeText={text => this.setState({ password: text })}
              value={this.state.password}
              style={[styles.input, { marginTop: 16 }]}
              placeholder={i18n.t('signin.password')}
              placeholderTextColor={'#8C9091'}
            />

            <TouchableOpacity
              style={{ marginTop: 45, textAlign: 'center', alignItems: 'center', width: '100%' }}
              onPress={() => {
                this.props.navigation.navigate('RecoverPassword', {})
              }}
            >
              <Text style={styles.forgotPasswordText}>{i18n.t('signin.forgot_password')}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 48, padding: 16, width: '100%' }}>
            <TouchableOpacity style={styles.loginButton} onPress={this._signIn}>
              <Text style={styles.loginButtonText}>{i18n.t('signin.login')}</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              paddingLeft: 16,
              paddingRight: 16,
              paddingBottom: 32,
              width: '100%',
              marginTop: 4
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 18,
                fontFamily: fontFamily.gothamBold,
                textAlign: 'center'
              }}
            >
              {i18n.t('auth_choice.or')}
            </Text>

            <View
              style={{
                ...styles.socialButtonBox,
                marginTop: 16
              }}
            >
              <View
                style={{
                  ...styles.socialButton,
                  borderWidth: 1,
                  borderColor: '#2b369b',
                  backgroundColor: '#202873',
                  marginRight: 8
                }}
                // onLayout={event =>
                //   console.log(event.nativeEvent.layout.height, event.nativeEvent.layout.width)
                // }
              >
                <TouchableOpacity
                  style={styles.socialButtonInbox}
                  onPress={() => {
                    this._authFacebook()
                  }}
                >
                  <Text style={styles.socialButtonText}>{i18n.t('auth_choice.facebook')}</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  ...styles.socialButton,
                  borderWidth: 1,
                  borderColor: '#f40b09',
                  backgroundColor: '#C30907',
                  marginLeft: 8
                }}
                // onLayout={event =>
                //   console.log(event.nativeEvent.layout.height, event.nativeEvent.layout.width)
                // }
              >
                <TouchableOpacity
                  style={styles.socialButtonInbox}
                  onPress={() => {
                    this._authGoogle()
                  }}
                >
                  <Text style={styles.socialButtonText}>{i18n.t('auth_choice.google')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {isIOS && appleAuth.isSupported && appleAuth.isSignUpButtonSupported ? (
              <View
                style={{
                  marginTop: 24
                }}
                // onLayout={event =>
                //   console.log(event.nativeEvent.layout.height, event.nativeEvent.layout.width)
                // }
              >
                <AppleButton
                  buttonStyle={AppleButton.Style.WHITE}
                  buttonType={AppleButton.Type.SIGN_IN}
                  style={{
                    width: '100%',
                    height: 53
                  }}
                  onPress={() => this._authApple()}
                />
              </View>
            ) : null}
          </View>
        </ScrollView>
      </ImageBackground>
    )
  }

  async _authApple() {
    console.log('_authApple()')

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
      })

      console.log('appleAuthRequestResponse', appleAuthRequestResponse)

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      try {
        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user)

        console.log('credentialState', credentialState)

        // use credentialState response to ensure the user is authenticated

        if (credentialState === appleAuth.State.AUTHORIZED) {
          // user is authenticated
          console.log('_authApple() user is authorized')
          let userFullName = appleAuthRequestResponse.fullName
            ? appleAuthRequestResponse.fullName.givenName && appleAuthRequestResponse.fullName.familyName
              ? `${appleAuthRequestResponse.fullName.givenName} ${appleAuthRequestResponse.fullName.familyName}`
              : appleAuthRequestResponse.fullName.givenName
              ? appleAuthRequestResponse.fullName.givenName
              : appleAuthRequestResponse.fullName.familyName
              ? appleAuthRequestResponse.fullName.familyName
              : ''
            : ''

          this._externalSignIn(
            'Apple',
            appleAuthRequestResponse.user,
            appleAuthRequestResponse.identityToken,
            appleAuthRequestResponse.user,
            appleAuthRequestResponse.email,
            userFullName
          )
        }

        if (credentialState === appleAuth.State.NOT_FOUND) {
          console.log('_authApple() user is not found')
        }

        if (credentialState === appleAuth.State.REVOKED) {
          console.log('_authApple() user is revoked')
        }

        if (credentialState === appleAuth.State.TRANSFERRED) {
          console.log('_authApple() user is transferred')
        }
      } catch (error) {
        if (error.code === appleAuth.Error.CANCELED) {
          console.log('credentialState Error: CANCELED')
        }
        if (error.code === appleAuth.Error.FAILED) {
          console.log('credentialState Error: FAILED')
        }
        if (error.code === appleAuth.Error.INVALID_RESPONSE) {
          console.log('credentialState Error: INVALID_RESPONSE')
        }
        if (error.code === appleAuth.Error.NOT_HANDLED) {
          console.log('credentialState Error: NOT_HANDLED')
        }
        if (error.code === appleAuth.Error.UNKNOWN) {
          console.log('credentialState Error: UNKNOWN')
        }
        console.log('credentialState Error', error)

        // TEST FOR EMULATORS
        let userFullName = appleAuthRequestResponse.fullName
          ? appleAuthRequestResponse.fullName.givenName && appleAuthRequestResponse.fullName.familyName
            ? `${appleAuthRequestResponse.fullName.givenName} ${appleAuthRequestResponse.fullName.familyName}`
            : appleAuthRequestResponse.fullName.givenName
            ? appleAuthRequestResponse.fullName.givenName
            : appleAuthRequestResponse.fullName.familyName
            ? appleAuthRequestResponse.fullName.familyName
            : ''
          : ''

        this._externalSignIn(
          'Apple',
          appleAuthRequestResponse.user,
          appleAuthRequestResponse.identityToken,
          appleAuthRequestResponse.user,
          appleAuthRequestResponse.email,
          userFullName
        )
      }
    } catch (e) {
      console.log('appleAuthRequestResponse Error', e)
    }
  }

  _authFacebook = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        console.log('Facebook _authFacebook result', result)

        if (result.isCancelled) {
          // alert("Login cancelled");
        } else {
          // array result.grantedPermissions

          AccessToken.getCurrentAccessToken().then(data => {
            console.log('Facebook AccessToken.getCurrentAccessToken()', data)

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
        console.log('_loadFbUser result', responseJson)

        if (responseJson) {
          // .id, .name., .email
          alert(responseJson.name)
        }
      })
  }

  _externalSignIn = (provider, key, token, id, email, fullName) => {
    headers = { Accept: 'application/json', 'Content-Type': 'application/json' }
    // if (this.user.token && this.user.token.length > 4) headers['auth-token'] = this.user.token;

    const body = JSON.stringify({
      Provider: provider,
      ProviderKey: key,
      ExternalAccessToken: token,
      ...(Boolean(id) && {
        ExternalUserId: id
      }),
      ...(Boolean(email) && {
        ExternalUserEmail: email
      }),
      ...(Boolean(fullName) && {
        ExternalUserFullname: fullName
      })
    })

    // alert(body);
    console.log('_externalSignIn body', body)

    fetch(`${env.api}api/account/external/signin`, {
      method: 'POST',
      headers,
      body
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        if (responseJson.Token) {
          this.user = responseJson.SignedInUser

          this.user.token = responseJson.Token
          this.user.firstName = responseJson.SignedInUser.FirstName
          this.user.lastName = responseJson.SignedInUser.LastName
          this.user.name = responseJson.SignedInUser.FullName
          this.user.email = responseJson.SignedInUser.Email
          this.user.country = responseJson.SignedInUser.CountryId
          this.user.language = responseJson.SignedInUser.LanguageId
          this.user.phone = responseJson.SignedInUser.Phone
          this.user.image = responseJson.SignedInUser.ImageURL || null
          this.user.avatar = responseJson.SignedInUser.ImageThumbURL || null

          Global.user = this.user

          console.log('SignIn this.user', this.user)

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
          this.user = data.SignedInUser

          this.user.token = data.Token
          this.user.name = data.SignedInUser.FullName
          this.user.firstName = data.SignedInUser.FirstName
          this.user.lastName = data.SignedInUser.LastName
          this.user.email = data.SignedInUser.Email
          this.user.country = data.SignedInUser.CountryId
          this.user.language = data.SignedInUser.LanguageId
          this.user.phone = data.SignedInUser.Phone
          this.user.image = data.SignedInUser.ImageURL || null
          this.user.avatar = data.SignedInUser.ImageThumbURL || null

          Global.user = this.user

          console.log('SignIn this.user', this.user)

          AsyncStorage.setItem('app:user', JSON.stringify(this.user))

          // console.log('SignIn this.user', this.user);

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
  forgotPasswordText: {
    fontFamily: fontFamily.gothamBold,
    fontSize: 12,
    color: '#FFFFFF'
  },
  input: {
    backgroundColor: '#EEEFEF',
    borderRadius: 4,
    width: '100%',
    height: 40,
    padding: 5,
    paddingLeft: 16,
    color: '#8C9091',
    fontFamily: fontFamily.gothamMedium,
    fontSize: 14
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
    backgroundColor: '#202873',
    paddingBottom: 22,
    paddingTop: Platform.OS === 'ios' ? 65 : 25,
    paddingLeft: 16
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fontFamily.gothamMedium
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fontFamily.gothamLight,
    padding: 8
  },
  socialButton: {
    flex: 1,
    borderRadius: 4
  },
  socialButtonInbox: {
    padding: 12,
    borderRadius: 4,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  socialButtonBox: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.gothamMedium,
    textAlign: 'center',
    alignItems: 'center'
  }
})
