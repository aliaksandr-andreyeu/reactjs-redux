import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground,
  TextInput,
  PixelRatio
} from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'

import i18n from '../../i18n'
import { fontFamily } from '../constants/fonts'
import { onLocaleChange } from '../constants/fonts'

import WelcomeBgImage from '../assets/images/LanguageBg.png'
import SkewedContainer from '../components/SkewedContainer'
import colors from '../constants/colors'

import isEqual from 'lodash.isequal'

import Global from '../components/global'

import env from '../config'

import { externalLinks, axiosInstance, apiUrls } from '../constants/api'

export default class WelcomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    isLoading: true,
    currentText: '',
    user: {},
    languages: [
      {
        id: 0,
        title: i18n.t('welcome.english'),
        code: 'en'
      },
      {
        id: 1,
        title: i18n.t('welcome.arabic'),
        code: 'ar'
      }
    ],
    selectedLanguage: 0,
    isShowLanguageDialogue: false,
    dimensions: {
      window: Dimensions.get('window'),
      screen: Dimensions.get('screen')
    }
  }

  constructor() {
    super()
  }

  async componentDidMount() {
    setTimeout(() => {
      if (false && __DEV__) {
        this.props.navigation.navigate('Home', {})
        return true
      }
    }, 1000)

    Dimensions.addEventListener('change', this.onChange)

    let locale = 0
    if (i18n.locale === 'ar') {
      locale = 1
    }

    try {
      const storedValue = await AsyncStorage.getItem('app:user')

      if (storedValue) {
        Global.user = JSON.parse(storedValue)
        console.log('Welcome JSON.parse(storedValue)', JSON.parse(storedValue))

        if (Global.user && Global.user.token && Global.user.token.length > 5) {
          this.props.navigation.navigate('Home', {})
        } else {
          this.setState({
            user: JSON.parse(storedValue),
            selectedLanguage: locale,
            isLoading: false
          })
        }
      } else {
        let userModel = {
          name: '',
          firstName: '',
          lastName: '',
          email: '',
          country: 0,
          language: 0,
          phone: '',
          token: '',
          id: null
        }

        // console.log('Welcome JSON.parse(storedValue)', JSON.parse(storedValue));

        Global.user = userModel

        this.setState({
          user: userModel,
          selectedLanguage: locale,
          isLoading: false
        })
      }
      console.log('Welcome GLOBAL', Global)
    } catch (e) {
      console.log('Error:', e)
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props, prevProps)) {
      this.checkUser()
    }
  }

  async checkUser() {
    try {
      const storedValue = await AsyncStorage.getItem('app:user')

      if (storedValue) {
        Global.user = JSON.parse(storedValue)

        if (Global.user && Global.user.token && Global.user.token.length > 5) {
          this.props.navigation.navigate('Home', {})
        } else {
          this.setState({
            isLoading: false
          })
        }
      } else {
        this.setState({
          isLoading: false
        })
      }
    } catch (e) {
      console.log('Error:', e)
    }
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onChange)
  }

  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } })
  }

  render() {
    const { dimensions, isLoading } = this.state

    const pixelRatio = PixelRatio.get()

    return isLoading ? null : (
      <ImageBackground source={WelcomeBgImage} style={{ width: '100%', height: '100%' }}>
        <View
          style={{
            position: 'absolute',
            flex: 1,
            width: '100%',
            bottom: dimensions.window.height > 736 ? 54 : dimensions.window.height > 480 ? 10 : 0,
            textAlign: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={styles.selectYourLanguage}>
            {dimensions.window.height > 667
              ? i18n.t('welcome.please_select_your_language')
              : i18n.t('welcome.please_select_your_language_short')}
          </Text>

          <View
            style={{
              ...styles.bookingsSearchButton,
              marginTop: 15,
              textAlign: 'center',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.selectLanguage(0)
              }}
            >
              <SkewedContainer
                backgroundColor={colors.themeColor}
                leftSkewType="desc"
                rightSkewType="asc"
                // width={dimensions.window.height > 667 ? 32 : 26}
                // height={dimensions.window.height > 667 ? 32 : 26}
                width={32}
                height={32}
              >
                <View
                  style={{
                    ...styles.selectedLanguageBox,
                    lineHeight: 32,
                    // height: dimensions.window.height > 667 ? 32 : 26,
                    height: 32
                  }}
                >
                  <Text
                    style={{
                      ...styles.selectedLanguage,
                      width: pixelRatio > 2 ? 140 : pixelRatio > 1.5 ? 120 : pixelRatio > 1 ? 100 : 80
                    }}
                  >
                    {this.state.languages[0].title}
                  </Text>
                </View>
              </SkewedContainer>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.selectLanguage(1)
              }}
            >
              <View
                style={{
                  ...styles.selectedLanguageBox,
                  height: dimensions.window.height > 667 ? 32 : 26,
                  marginTop: 5
                }}
              >
                <Text
                  style={{
                    ...styles.selectedLanguage,
                    color: '#202873'
                  }}
                >
                  {this.state.languages[1].title}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 22, textAlign: 'center', alignItems: 'center' }}
              onPress={() => {
                this.props.navigation.navigate('SignIn', {})
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.authText, {}]}>{i18n.t('auth_choice.already_have_an_account')}</Text>
                <Text style={[styles.authText, { marginLeft: 5, fontFamily: fontFamily.gothamBold }]}>
                  {i18n.t('auth_choice.login')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    )
  }

  selectLanguage(id) {
    i18n.locale = id === 0 ? 'en' : 'ar'
    onLocaleChange()

    this.setState(
      {
        selectedLanguage: id
      },
      () => {
        this.finishSelection()
      }
    )
  }

  toggleLanguageDialogue() {
    this.setState({
      isShowLanguageDialogue: !this.state.isShowLanguageDialogue
    })
  }

  finishSelection = () => {
    if (this.state.user.token) {
      this.props.navigation.navigate('Home', {
        isSkipped: false
      })
    } else {
      AsyncStorage.setItem('app:user', JSON.stringify(this.state.user))

      this.props.navigation.navigate('AuthChoice', {
        isSkipped: false
      })
    }
  }
}

const styles = StyleSheet.create({
  languageItem: {
    paddingLeft: 22,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 25
  },
  radio: {
    width: 25,
    height: 25,
    borderRadius: 255,
    backgroundColor: '#ffffff',
    borderColor: '#8C9091',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  radioSelected: {
    backgroundColor: '#ffffff',
    borderColor: '#202873'
  },
  radioBullet: {
    backgroundColor: '#202873',
    width: 15,
    height: 15,
    borderRadius: 255
  },
  languageLabel: {
    color: '#575756',
    fontSize: 14,
    marginLeft: 11,
    fontFamily: fontFamily.gothamMedium,
    marginTop: 2
  },
  selectYourLanguageDone: {
    color: '#202873',
    fontSize: 16,
    padding: 25,
    paddingBottom: 17,
    fontFamily: fontFamily.gothamMedium,
    textAlign: 'right',
    alignSelf: 'flex-end',
    width: '100%'
  },
  selectYourLanguageTitle: {
    fontFamily: fontFamily.gothamMedium,
    color: '#575756',
    fontSize: 18,
    padding: 19,
    paddingBottom: 15,
    textAlign: 'center',
    borderBottomColor: '#e2e3e3',
    borderBottomWidth: 2,
    width: '100%'
  },
  languageDialogueContainer: {
    position: 'absolute',
    flex: 1,
    width: '65%',
    bottom: 15,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 9999999,
    backgroundColor: '#FFFFFF',
    borderRadius: 8
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  contentContainer: {
    paddingTop: 30
  },
  selectYourLanguage: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: 14,
    color: '#202873'
  },
  selectedLanguageBox: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  selectedLanguage: {
    color: '#FFFFFF',
    fontFamily: fontFamily.gothamMedium,
    fontSize: 12,
    textTransform: 'uppercase',
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  authText: {
    color: '#202873',
    fontSize: 12,
    fontFamily: fontFamily.gothamLight,
    textAlign: 'center',
    lineHeight: 19
  }
})
