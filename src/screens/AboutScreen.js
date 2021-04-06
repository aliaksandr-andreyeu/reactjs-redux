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
  Alert
} from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'

import Prompt from 'rn-prompt'

import { createIconSetFromFontello } from 'react-native-vector-icons'
import fontelloConfig from '../assets/fonts/customicons-config.json'

import i18n from '../../i18n'

FontBreeBold = Platform.OS === 'ios' ? 'bree-bold' : 'BreeBold'
FontBreeRegular = Platform.OS === 'ios' ? 'bree-regular' : 'BreeRegular'

const Icon = createIconSetFromFontello(fontelloConfig)

export default class AboutScreen extends React.Component {
  static navigationOptions = {}

  state = {
    name: '',
    email: '',
    phone: '',
    user: {},
    profilePrompt: {
      isVisible: false,
      value: '',
      field: '',
      title: ''
    }
  }

  async componentDidMount() {
    let storedValue = await AsyncStorage.getItem('app:user')

    if (storedValue == null) {
      this.setState({
        user: {
          name: 'Name',
          email: 'email@example.com',
          country: 0,
          language: 0,
          phone: '+0 (000) 0000000',
          token: ''
        }
      })
    } else {
      storedValue = JSON.parse(storedValue)

      this.setState({
        user: storedValue
      })
    }

    this.setState({
      isLoading: false
    })
  }

  constructor(props) {
    super(props)
  }

  render() {
    if (this.state.isLoading) {
      return <View />
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 40
            }}
          >
            <Image source={require('../assets/images/about_logo.png')} style={{ marginBottom: 50 }} />

            <Text
              style={{
                color: '#A2A2A2',
                fontSize: 12,
                fontFamily: 'HelveticaNeue',
                paddingBottom: 6,
                textAlign: 'center'
              }}
            >
              Version Number: 1.3
            </Text>

            <Text
              style={{
                color: '#6D6E71',
                fontSize: 12,
                fontFamily: 'HelveticaNeue',
                paddingBottom: 0,
                textAlign: 'center'
              }}
            >
              {i18n.t('about.text')}
            </Text>
          </View>

          <View style={{ textAlign: 'center', paddingTop: 70 }}>
            <Text
              onPress={() => {
                this.props.navigation.navigate('Privacy', {})
              }}
              style={{
                color: '#2F8C83',
                fontSize: 14,
                fontFamily: FontBreeBold,
                paddingBottom: 25,
                textAlign: 'center'
              }}
            >
              {i18n.t('more.privacy_policy')}
            </Text>

            <Text
              onPress={() => {
                this.props.navigation.navigate('TOS', {})
              }}
              style={{
                color: '#2F8C83',
                fontSize: 14,
                fontFamily: FontBreeBold,
                paddingBottom: 0,
                textAlign: 'center'
              }}
            >
              {i18n.t('more.terms_of_use')}
            </Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  contentContainer: {
    marginLeft: 50,
    marginRight: 50,
    paddingBottom: 30,
    paddingTop: 30
  },
  greenButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#2F8C83',
    borderRadius: 80,
    borderWidth: 2,
    flex: 1,
    padding: 8,
    paddingLeft: 10,
    paddingRight: 10
  },
  greenButtonRegister: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#c1c1c1',
    borderRadius: 80,
    borderWidth: 2,
    flex: 1,
    marginLeft: 5,
    padding: 8,
    paddingLeft: 10,
    paddingRight: 10
  },
  horizontalLine: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 24,
    marginTop: 24,
    opacity: 0.1
  },
  profileTextItem: {
    color: '#949494',
    fontFamily: FontBreeBold,
    fontSize: 15
  }
})
