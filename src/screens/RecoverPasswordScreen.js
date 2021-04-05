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

import SigninBgImage from '../assets/images/signInBg.jpg';

import i18n from '../../i18n';
import Icon from '../components/Icon';
import { fontFamily } from '../constants/fonts';

import env from '../config';

export default class RecoverPasswordScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    email: '',
    isOTPSent: false,
    otp: '',
    code: '',
    new_password: '',
    confirm_password: '',
  };

  user = {};

  constructor(props) {
    super(props);
  }

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

            <Text style={[styles.headerTitle, { marginLeft: 28 }]}>
              {i18n.t('recover.forgot_password')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 16, paddingTop: 32, paddingBottom: 0 }}>
          <TextInput
            autocomplete="email"
            keyboardType="email-address"
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
            style={styles.input}
            placeholder={i18n.t('recover.email')}
            placeholderTextColor={'#8C9091'}
          />

          {this.state.isOTPSent && (
            <View>
              <TextInput
                secureTextEntry
                onChangeText={text => this.setState({ otp: text })}
                value={this.state.otp}
                style={[styles.input, { marginTop: 16 }]}
                placeholder={i18n.t('recover.otp')}
                placeholderTextColor={'#8C9091'}
              />

              <TextInput
                secureTextEntry
                onChangeText={text => this.setState({ new_password: text })}
                value={this.state.new_password}
                style={[styles.input, { marginTop: 16 }]}
                placeholder={i18n.t('recover.new_password')}
                placeholderTextColor={'#8C9091'}
              />

              <TextInput
                secureTextEntry
                onChangeText={text => this.setState({ confirm_password: text })}
                value={this.state.confirm_password}
                style={[styles.input, { marginTop: 16 }]}
                placeholder={i18n.t('recover.confirm_password')}
                placeholderTextColor={'#8C9091'}
              />
            </View>
          )}
        </View>

        <View style={{ marginTop: 54, padding: 16, width: '100%' }}>
          <TouchableOpacity style={styles.loginButton} onPress={this._recoverPassword}>
            <Text style={styles.loginButtonText}>
              {this.state.isOTPSent ? i18n.t('recover.login') : i18n.t('recover.send')}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  toJSON(raw) {
    try {
      return JSON.parse(raw);
    } catch (err) {
      return false;
    }
  }

  setNewPassword = () => {
    if (!this.state.email || this.state.email.length < 5) {
      Alert.alert(i18n.t('recover.account_does_not_exist'));
      return;
    }

    if (!this.state.new_password || this.state.new_password.length < 5) {
      Alert.alert(i18n.t('recover.please_input_password'));
      return;
    }

    if (this.state.new_password !== this.state.confirm_password) {
      Alert.alert(i18n.t('recover.passwords_do_not_match'));
      return;
    }

    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.user.token && this.user.token.length > 4) {
      headers['auth-token'] = this.user.token;
    }

    fetch(`${env.api}/account/ChangePasswordAsync`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        code: this.state.code,
        otp: this.state.otp,
        newpwd: this.state.new_password,
        confirmPassword: this.state.confirm_password,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        let json = this.toJSON(responseJson);

        if (json && !json.IsError) {
          this.props.navigation.navigate('SignIn', {});
        } else if (json && json.Message) {
          Alert.alert(json.Message);
        } else {
          Alert.alert(i18n.t('recover.account_does_not_exist'));
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

  _recoverPassword = () => {
    if (!this.state.email || this.state.email.length < 5) {
      Alert.alert(i18n.t('recover.account_does_not_exist'));
      return;
    }

    if (this.state.isOTPSent) {
      this.setNewPassword();

      return;
    }

    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.user.token && this.user.token.length > 4) {
      headers['auth-token'] = this.user.token;
    }

    fetch(`${env.api}api/account/recover-password`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        Email: this.state.email,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        let json = this.toJSON(responseJson);

        if (json && !json.IsError) {
          Alert.alert(i18n.t('recover.you_will_recieve'));

          this.setState({
            isOTPSent: true,
            code: json.additionalInfo,
          });
        } else if (json && json.Message) {
          Alert.alert(json.Message);
        } else {
          Alert.alert(i18n.t('recover.account_does_not_exist'));
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
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#EEEFEF',
    borderRadius: 4,
    width: '100%',
    height: 40,
    padding: 5,
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
