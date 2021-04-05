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
  ImageBackground,
} from 'react-native';

import AuthBgImage from '../assets/images/auth-bg.png';

import i18n from '../../i18n';

FontBreeBold = Platform.OS === 'ios' ? 'bree-bold' : 'BreeBold';
FontBreeRegular = Platform.OS === 'ios' ? 'bree-regular' : 'BreeRegular';

export default class AuthChoiceScreen_beforeRedesign extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <ImageBackground source={AuthBgImage} style={{ width: '100%', height: '100%' }}>
        <View style={{ flex: 1, paddingTop: 30 }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flex: 4 }} />
            <View style={{ flex: 6, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('SignIn', {});
                }}
                style={styles.authButton}
              >
                <Text
                  style={{
                    fontFamily: FontBreeRegular,
                    fontSize: 14,
                    color: '#6D6E71',
                  }}
                >
                  {i18n.t('signup.sign_in')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('SignUp', {});
                }}
                style={styles.authButton}
              >
                <Text
                  style={{
                    fontFamily: FontBreeRegular,
                    fontSize: 14,
                    color: '#6D6E71',
                  }}
                >
                  {i18n.t('signup.sign_up')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Home', {});
                }}
                style={styles.askMeLaterButton}
              >
                <Text
                  style={{
                    fontFamily: 'Helvetica Neue',
                    fontWeight: 'bold',
                    fontSize: 10,
                    color: '#F7F7F7',
                  }}
                >
                  {i18n.t('signup.ask_me_later')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  askMeLaterButton: {
    padding: 7,
    // borderWidth: 2,
    // borderColor: '#2F8C83',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#06a09a',
    borderRadius: 90,
    paddingLeft: 10,
    paddingRight: 10,
    width: 100,
  },
  authButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#6d6e71',
    alignItems: 'center',
    // backgroundColor: '#06a09a',
    borderRadius: 60,
    opacity: 0.6,
    paddingRight: 65,
    paddingLeft: 65,
    marginBottom: 25,
    width: 235,
  },
  container: {
    flex: 1,
    //    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 30,
  },
  contentContainer: {
    paddingTop: 30,
  },
  developmentModeText: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 20,
    textAlign: 'center',
  },
});
