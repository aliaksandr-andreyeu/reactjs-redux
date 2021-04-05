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
  Dimensions,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Global from '../components/global';

import { LinearGradient } from 'expo-linear-gradient';

import env from '../config';

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

import AuthBgImage from '../assets/images/AuthChoiceBg.png';
import ShapeBG from '../assets/images/shape.png';

import { axiosInstance } from '../constants/api';
import { fontFamily } from '../constants/fonts';
import SkewedContainer from '../components/SkewedContainer';
import colors from '../constants/colors';
import getStyles from './styles';

export default class AuthChoiceScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    email: '',
    password: '',
    dimensions: {
      window: Dimensions.get('window'),
      screen: Dimensions.get('screen'),
    },
  };

  user = {};

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    Dimensions.addEventListener('change', this.onChange);

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

    signupUser = this.props.navigation.getParam('object', {});
    if (signupUser && signupUser.email) {
      this.setState({ email: signupUser.email });
    }
    if (signupUser && signupUser.password) {
      this.setState({ password: signupUser.password });
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

      // alert(JSON.stringify(userInfo));

      console.log('User Info --> ', userInfo);

      this._externalSignIn('Google', userInfo.user.id, userInfo.idToken);
    } catch (error) {
      console.log('Message', error.message, error.code);

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

  _authFacebook = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        console.log('Facebook _authFacebook result', result);

        if (result.isCancelled) {
          // alert("Login cancelled");
        } else {
          // array result.grantedPermissions

          AccessToken.getCurrentAccessToken().then(data => {
            console.log('Facebook AccessToken.getCurrentAccessToken()', data);

            this._externalSignIn('Facebook', data.userID, data.accessToken);

            // this._loadFbUser(data);
          });
        }
      },
      error => {
        alert(`Login fail with error: ${error}`);
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
        console.log('_loadFbUser result', responseJson);

        if (responseJson) {
          // .id, .name., .email
          alert(responseJson.name);
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

    // alert(body);

    console.log('_externalSignIn body', body);

    fetch(`${env.api}api/account/external/signin`, {
      method: 'POST',
      headers,
      body,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('_externalSignIn responseJson', responseJson);

        if (responseJson.Token) {
          this.user.token = responseJson.Token;
          this.user.name = responseJson.SignedInUser.FullName;
          this.user.firstName = responseJson.SignedInUser.FirstName;
          this.user.lastName = responseJson.SignedInUser.LastName;
          this.user.email = responseJson.SignedInUser.Email;
          this.user.country = responseJson.SignedInUser.CountryId;
          this.user.language = responseJson.SignedInUser.LanguageId;
          this.user.phone = responseJson.SignedInUser.Phone || null;
          this.user.image = responseJson.SignedInUser.ImageURL || null;
          this.user.avatar = responseJson.SignedInUser.ImageThumbURL || null;

          Global.user = this.user;

          console.log('AuthChoiceScreen Global.user', Global.user);

          AsyncStorage.setItem('app:user', JSON.stringify(this.user));

          //console.log('AuthChoiceScreen this.user', this.user);

          //this._signIn();

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

  _signIn = () => {
    headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (this.user.token && this.user.token.length > 4) {
      headers['auth-token'] = this.user.token;
    }

    console.log(this.state.email);
    console.log(this.state.password);

    axiosInstance
      .post(`${env.api}api/account/signin`, {
        Email: this.state.email,
        Password: this.state.password,
      })
      .then(({ data }) => {
        if (data.Token) {
          this.user.token = data.Token;
          this.user.name = data.SignedInUser.FullName;
          this.user.firstName = data.SignedInUser.FirstName;
          this.user.lastName = data.SignedInUser.LastName;
          this.user.email = data.SignedInUser.Email;
          this.user.country = data.SignedInUser.CountryId;
          this.user.language = data.SignedInUser.LanguageId;
          this.user.phone = data.SignedInUser.Phone;
          this.user.image = data.SignedInUser.ImageURL || null;
          this.user.avatar = data.SignedInUser.ImageThumbURL || null;

          Global.user = this.user;

          AsyncStorage.setItem('app:user', JSON.stringify(this.user));

          //console.log('AuthChoiceScreen this.user', this.user);

          this.props.navigation.navigate('Home');
        } else {
          Alert.alert(data.Message);
        }
      })
      .catch(err => console.log(err));
  };

  _signUpFacebook = () => {
    console.log(this.state);

    this.props.navigation.navigate('Home');
  };

  _signUpGoogle = () => {
    console.log(this.state);

    this.props.navigation.navigate('Home');
  };

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onChange);
  }

  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } });
  };

  render() {
    const { dimensions } = this.state;

    return (
      <ImageBackground source={AuthBgImage} style={{ width: '100%', height: '100%' }}>
        <View
          style={{
            ...getStyles().choiceContainer,
            bottom: dimensions.window.height > 736 ? 54 : dimensions.window.height > 480 ? 10 : 0,
          }}
        >
          <Text style={getStyles().text}>{i18n.t('auth_choice.signup')}</Text>

          <TouchableOpacity
            style={{
              marginTop: 8,
            }}
            onPress={() => {
              this.props.navigation.navigate('SignUp', {});
            }}
          >
            <ImageBackground
              source={ShapeBG}
              style={{
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 178,
                height: 34,
                padding: 8,
              }}
            >
              <Text
                style={[
                  getStyles().text,
                  {
                    fontSize: 12,
                    textAlign: 'center',
                  },
                ]}
              >
                {i18n.t('auth_choice.using_email')}
              </Text>
            </ImageBackground>
          </TouchableOpacity>

          <Text style={[getStyles().text, { marginTop: 3 }]}>{i18n.t('auth_choice.or')}</Text>

          <View
            style={{
              flexDirection: 'row',
              marginTop: dimensions.window.height > 480 ? 8 : 0,
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                marginRight: 2,
                alignItems: 'flex-end',
              }}
              onPress={() => {
                this._authFacebook();
              }}
            >
              <SkewedContainer backgroundColor={'#202873'} leftSkewType="asc">
                <Text
                  style={[
                    getStyles().authButtonText,
                    {
                      // paddingRight: 24,
                      paddingRight: 12,
                      minWidth: 100,
                      // textAlign: 'right',
                      textAlign: 'center',
                    },
                  ]}
                >
                  {i18n.t('auth_choice.facebook')}
                </Text>
              </SkewedContainer>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1, marginLeft: 2, alignItems: 'flex-start' }}
              onPress={() => {
                this._authGoogle();
              }}
            >
              <SkewedContainer backgroundColor={'#C30907'} rightSkewType="desc">
                <Text
                  style={[
                    getStyles().authButtonText,
                    {
                      // paddingLeft: 24,
                      paddingLeft: 12,
                      minWidth: 100,
                      // textAlign: 'left',
                      textAlign: 'center',
                    },
                  ]}
                >
                  {i18n.t('auth_choice.google')}
                </Text>
              </SkewedContainer>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginTop:
                dimensions.window.height > 736
                  ? 45
                  : dimensions.window.height > 592
                  ? 40
                  : dimensions.window.height > 480
                  ? 16
                  : 8,
              paddingLeft: 15,
              paddingRight: 15,
            }}
          >
            <TouchableOpacity
              style={{ flex: 6, alignItems: 'flex-start' }}
              onPress={() => {
                this.props.navigation.navigate('SignIn', {});
              }}
            >
              <Text style={[getStyles().linksText]}>
                {i18n.t('auth_choice.already_have_an_account')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 4, alignItems: 'flex-end' }}
              onPress={() => {
                this.props.navigation.navigate('Home', {});
              }}
            >
              <Text style={[getStyles().linksText]}>{i18n.t('auth_choice.skip')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
