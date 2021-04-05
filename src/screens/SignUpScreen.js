import React from 'react';
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
  StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import { LinearGradient } from 'expo-linear-gradient';

import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import i18n from '../../i18n';

import { fontFamily } from '../constants/fonts';
import SigninBgImage from '../assets/images/signInBg.jpg';
import Icon from '../components/Icon';
import Global from '../components/global';

import env from '../config';

export default class SignUpScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    tos1: true,
    tos2: true,
  };

  user = {};

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const storedValue = await AsyncStorage.getItem('app:user');
    if (storedValue == null) {
      this.user = {
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        country: 0,
        language: 0,
        phone: '',
        token: '',
      };
    } else {
      this.user = JSON.parse(storedValue);
    }

    GoogleSignin.configure({
      // It is mandatory to call this method before attempting to call signIn()
      scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      webClientId: '970814518409-4vl92cmc481k2kvegevsdmnju9q62ofl.apps.googleusercontent.com',
    });
  }

  _authGoogle = async () => {
    // Prompts a modal to let the user sign in into your application.
    try {
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed.
        // Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();

      // Alert.alert(JSON.stringify(userInfo));

      console.log('User Info --> ', userInfo);

      this._externalSignIn('Google', userInfo.user.id, userInfo.idToken);
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };

  _getCurrentUser = async () => {
    // May be called eg. in the componentDidMount of your main component.
    // This method returns the current user
    // if they already signed in and null otherwise.
    try {
      const userInfo = await GoogleSignin.signInSilently();
      this.setState({ userInfo });
    } catch (error) {
      console.log(error);
    }
  };

  _signOut = async () => {
    // Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null }); // Remove the user from your app's state as well
    } catch (error) {
      console.log(error);
    }
  };

  _revokeAccess = async () => {
    // Remove your application from the user authorized applications.
    try {
      await GoogleSignin.revokeAccess();
      console.log('deleted');
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <ImageBackground source={SigninBgImage} style={{ width: '100%', height: '100%' }}>
        <View style={styles.authHeader}>
          <TouchableOpacity
            style={{ flexDirection: 'row', width: '100%' }}
            onPress={() => {
              this.props.navigation.navigate('AuthChoice', {});
            }}
          >
            {Icon.getIcon(Icon.iconLibraries.fontAwesome, 'chevron-left', {
              size: 18,
              color: '#FFFFFF',
            })}

            <Text style={[styles.headerTitle, { marginLeft: 28 }]}>{i18n.t('signup.signup')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{
            padding: 16,
            paddingTop: 16,
            paddingBottom: 0,
          }}
        >
          <TextInput
            onChangeText={text => this.setState({ name: text })}
            value={this.state.name}
            style={styles.input}
            placeholder={i18n.t('signup.fullname')}
            placeholderTextColor={'#8C9091'}
          />

          <TextInput
            autocomplete="email"
            keyboardType="email-address"
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
            style={[styles.input, { marginTop: 16 }]}
            placeholder={i18n.t('signup.email')}
            placeholderTextColor={'#8C9091'}
          />

          <TextInput
            secureTextEntry
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
            style={[styles.input, { marginTop: 16 }]}
            placeholder={i18n.t('signup.password')}
            placeholderTextColor={'#8C9091'}
          />

          <TextInput
            secureTextEntry
            onChangeText={text => this.setState({ confirmPassword: text })}
            value={this.state.confirmPassword}
            style={[styles.input, { marginTop: 16 }]}
            placeholder={i18n.t('signup.confirm_password')}
            placeholderTextColor={'#8C9091'}
          />

          <View
            style={{
              paddingLeft: 16,
              paddingRight: 32,
              marginTop: 80,
              flexDirection: 'row',
              width: '100%',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ tos1: !this.state.tos1 });
              }}
            >
              {Icon.getIcon(
                Icon.iconLibraries.materialIcons,
                this.state.tos1 ? 'check-box' : 'check-box-outline-blank',
                {
                  size: 40,
                  color: '#00B5DF',
                }
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('Policy', {
                  constraint: 'terms-of-use',
                  isSignUp: true,
                })
              }
              style={{
                marginLeft: 16,
              }}
            >
              <Text style={styles.tosText}>
                {i18n.t('signup.tos1_0')}
                <Text style={[styles.tosText, styles.tosLink, { marginLeft: 0 }]}>
                  {i18n.t('signup.tos1_1')}
                </Text>
                .
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              paddingLeft: 16,
              paddingRight: 32,
              marginTop: 20,
              flexDirection: 'row',
              width: '100%',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ tos2: !this.state.tos2 });
              }}
            >
              {Icon.getIcon(
                Icon.iconLibraries.materialIcons,
                this.state.tos2 ? 'check-box' : 'check-box-outline-blank',
                {
                  size: 40,
                  color: '#00B5DF',
                }
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('Policy', {
                  constraint: 'privacy-policy',
                  isSignUp: true,
                })
              }
              style={{
                marginLeft: 16,
              }}
            >
              <Text style={styles.tosText}>
                {i18n.t('signup.tos2_0')}
                <Text style={[styles.tosText, styles.tosLink, { marginLeft: 0 }]}>
                  {i18n.t('signup.tos2_1')}
                </Text>
                .
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 54, padding: 16, paddingBottom: 48, width: '100%' }}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                this.state.tos1 && this.state.tos2
                  ? this._signUp()
                  : Alert.alert(i18n.t('signup.tos3'));
              }}
            >
              <Text style={styles.loginButtonText}>{i18n.t('signup.next')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  _authFacebook = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          // Alert.alert("Login cancelled");
        } else {
          // array result.grantedPermissions

          AccessToken.getCurrentAccessToken().then(data => {
            this._externalSignIn('Facebook', data.userID, data.accessToken);

            // this._loadFbUser(data);
          });
        }
      },
      error => {
        Alert.alert(`Login fail with error: ${error}`);
      }
    );
  };

  _loadFbUser = data => {
    headers = { Accept: 'application/json', 'Content-Type': 'application/json' };

    fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${data.accessToken}`, {
      method: 'GET',
      headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson) {
          // .id, .name., .email
          Alert.alert(responseJson.name);
        }
      });
  };

  _externalSignIn = (provider, key, token) => {
    headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    // if (this.user.token && this.user.token.length > 4) headers['auth-token'] = this.user.token;

    const body = JSON.stringify({
      Provider: provider,
      ProviderKey: key,
      ExternalAccessToken: token,
    });

    // Alert.alert(body);
    console.log(body);

    fetch(`${env.api}api/account/external/signin`, {
      method: 'POST',
      headers,
      body,
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        if (responseJson.Token) {
          this.user.token = responseJson.Token;
          this.user.name = responseJson.SignedInUser.FullName;
          this.user.firstName = responseJson.SignedInUser.FirstName;
          this.user.lastName = responseJson.SignedInUser.LastName;
          this.user.email = responseJson.SignedInUser.Email;
          this.user.country = responseJson.SignedInUser.CountryId;
          this.user.language = responseJson.SignedInUser.LanguageId;
          this.user.phone = responseJson.SignedInUser.Phone;
          this.user.image = responseJson.SignedInUser.ImageURL || null;
          this.user.avatar = responseJson.SignedInUser.ImageThumbURL || null;

          AsyncStorage.setItem('app:user', JSON.stringify(this.user));

          this.props.navigation.navigate('Home');
        } else {
          Alert.alert(responseJson.Message);
        }
      })
      .catch(error => {
        console.log('error', error);
        if (error && error.Message) {
          Alert.alert(error.Message);
        } else {
          Alert.alert(error);
        }
      });
  };

  _signUp = () => {
    if (!this.state.tos1) {
      return;
    }

    if (this.state.name.length < 3) {
      Alert.alert(i18n.t('signup.name_is_required'));
      return;
    }

    if (this.state.email.length < 5) {
      Alert.alert(i18n.t('signup.email_is_required'));
      return;
    }

    if (this.state.password !== this.state.confirmPassword) {
      Alert.alert(i18n.t('signup.passwords_do_not_match'));
      return;
    }

    if (this.state.password.length < 6) {
      Alert.alert(i18n.t('signup.password_must_be_at_least'));
      return;
    }

    headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (this.user.token && this.user.token.length > 4) {
      headers['auth-token'] = this.user.token;
    }

    fetch(`${env.api}api/account/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        FullName: this.state.name,
        Email: this.state.email,
        Password: this.state.password,
        ConfirmPassword: this.state.confirmPassword,
        CountryId: 1002,
        LanguageId: 2,
        IsGenderMale: false,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('SIGNUP', responseJson);

        if (responseJson.IsError) {
          Alert.alert(
            responseJson.Message,
            false,
            [
              {
                text: i18n.t('signup.login'),
                onPress: () => this.props.navigation.navigate('SignIn', {}),
              },
              {
                text: i18n.t('signup.cancel'),
                style: 'cancel',
              },
            ],
            {
              cancelable: false,
            }
          );

          return;
        }

        this.user.email = this.state.email;
        this.user.name = this.state.name;

        AsyncStorage.setItem('app:user', JSON.stringify(this.user));

        if (
          responseJson.Message &&
          responseJson.Message == 'Registration successful. Login is allowed for yourself.'
        ) {
          // Alert.alert(responseJson.Message);
          // this.props.navigation.navigate('SignIn', {object: this.state});

          this._signIn();
        }
      })
      .catch(error => {
        console.log('error', error);
        if (error && error.Message) {
          Alert.alert(error.Message);
        } else {
          Alert.alert(error);
        }
      });
  };

  _signIn = () => {
    headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (this.user.token && this.user.token.length > 4) {
      headers['auth-token'] = this.user.token;
    }

    fetch(`${env.api}api/account/signin`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        Email: this.state.email,
        Password: this.state.password,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.Token) {
          this.user = responseJson.SignedInUser;

          this.user.token = responseJson.Token;
          this.user.name = responseJson.SignedInUser.FullName;
          this.user.firstName = responseJson.SignedInUser.FirstName;
          this.user.lastName = responseJson.SignedInUser.LastName;
          this.user.email = responseJson.SignedInUser.Email;
          this.user.country = responseJson.SignedInUser.CountryId;
          this.user.language = responseJson.SignedInUser.LanguageId;
          this.user.phone = responseJson.SignedInUser.Phone;
          this.user.image = responseJson.SignedInUser.ImageURL || null;
          this.user.avatar = responseJson.SignedInUser.ImageThumbURL || null;

          Global.user = this.user;

          AsyncStorage.setItem('app:user', JSON.stringify(this.user));

          this.props.navigation.navigate('Home');
        } else {
          Alert.alert(responseJson.Message);
        }
      })
      .catch(error => {
        console.log('error', error);
        if (error && error.Message) {
          Alert.alert(error.Message);
        } else {
          Alert.alert(error);
        }
      });
  };

  _signUpFacebook = () => {
    console.log(this.state);

    this.props.navigation.navigate('Home');
  };

  _signUpGoogle = () => {
    console.log(this.state);

    this.props.navigation.navigate('Home');
  };
}

const styles = StyleSheet.create({
  tosText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 19,
    fontFamily: fontFamily.gothamThin,
    textDecorationLine: 'none',
  },
  tosLink: {
    fontFamily: fontFamily.gothamMedium,
    color: '#00B5DF',
    textDecorationLine: 'underline',
  },
  forgotPasswordText: {
    fontFamily: fontFamily.gothamBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#EEEFEF',
    borderRadius: 4,
    width: '100%',
    height: 40,
    padding: 4,
    paddingLeft: 16,
    color: '#8C9091',
    fontFamily: fontFamily.gothamMedium,
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#8C9091',
    borderRadius: 4,
    padding: 15,
    textAlign: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.gothamMedium,
    textAlign: 'center',
    alignItems: 'center',
  },
  authHeader: {
    backgroundColor: '#202873',
    paddingBottom: 22,
    paddingTop: Platform.OS === 'ios' ? 65 : 25,
    paddingLeft: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fontFamily.gothamMedium,
  },
});
