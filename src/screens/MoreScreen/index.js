import React, { Component } from 'react';
import {
  Modal,
  SectionList,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import constants from './constants';
import colorConstants from '../../constants/colors';
import { axiosInstance, apiUrls } from '../../constants/api';
import AccountDetails from './components/AccountDetails';
import Loading from '../../components/Loading';
import { NavHeaderUser } from '../../components/NavHeaderUser';

import { fontFamily, onLocaleChange } from '../../constants/fonts';

import Global from '../../components/global';
import i18n from '../../../i18n';

class MoreScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('more.title'),
    };
  };

  state = {
    isAuthorized: false,
    accountDetails: null,
    accountBalance: null,
    isLoading: true,
    modalVisible: false,
  };

  async componentDidMount() {
    let user = {};

    if (Global.user && Global.user.token && Global.user.token.length > 4) {
      user = Global.user;
    }

    if (user.token && user.token.length > 5) {
      axiosInstance(apiUrls.getAccountBalance).then(({ data }) => {
        this.setState({
          isAuthorized: true,
          accountDetails: user,
          accountBalance: data.current,
          isLoading: false,
        });
      });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  logOutUser = () => {
    const { navigation } = this.props;

    console.log('logOutUser');

    Global.logOut();

    AsyncStorage.setItem('app:user', JSON.stringify({})).then(res => {
      console.log('AsyncStorage.setItem Response', res);

      navigation.navigate('Auth');
    });
  };

  renderSectionHeader = ({ section: { title, data } }) => {
    const { isAuthorized } = this.state;

    if (!isAuthorized && data.every(item => item.authorizedOnly)) {
      return null;
    }

    return (
      <Text
        style={{
          ...styles.sectionHeader,
          textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
        }}
      >
        {title()}
      </Text>
    );
  };

  modalLanguage() {
    const { modalVisible } = this.state;

    const languages = [
      {
        title: i18n.t('welcome.english'),
        code: 'en',
      },
      {
        title: i18n.t('welcome.arabic'),
        code: 'ar',
      },
    ];

    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        // visible={true}
        onRequestClose={() => this.closeModalLanguage()}
        onDismiss={() => this.closeModalLanguage()}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <TouchableOpacity
            onPress={() => this.closeModalLanguage()}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 16,
            }}
          >
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              {languages
                .sort((a, b) =>
                  i18n.locale.toLowerCase() == 'ar'
                    ? a.code > b.code
                      ? 1
                      : b.code > a.code
                      ? -1
                      : 0
                    : a.code < b.code
                    ? 1
                    : b.code < a.code
                    ? -1
                    : 0
                )
                .map((item, i) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor:
                        item.code.toLowerCase() == i18n.locale.toLowerCase()
                          ? colorConstants.themeColor
                          : 'transparent',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.selectLanguage(item.code);
                      }}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        paddingTop: 8,
                        paddingBottom: 8,
                        paddingLeft: 32,
                        paddingRight: 32,
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: 'center',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          color:
                            item.code.toLowerCase() == i18n.locale.toLowerCase()
                              ? colorConstants.basicLightText
                              : colorConstants.themeColor,
                          fontSize: 18,
                          fontFamily: fontFamily.gothamMedium,
                          lineHeight: 30,
                        }}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  closeModalLanguage() {
    this.setState({
      modalVisible: false,
    });
  }

  openModalLanguage() {
    this.setState({
      modalVisible: true,
    });
  }

  selectLanguage(id) {
    const { navigation } = this.props;

    i18n.locale = id;
    onLocaleChange();

    navigation.replace('More');
    navigation.popToTop();
    navigation.navigate('More');
  }

  renderItem = item => {
    const { isAuthorized } = this.state;
    const { navigation } = this.props;

    const shouldRender = item.authorizedOnly ? isAuthorized : true;

    if (!shouldRender) {
      return null;
    }

    const onPressAction = item.modalLanguage
      ? () => this.openModalLanguage()
      : item.targetScreen
      ? () => navigation.navigate(item.targetScreen, item.navigationParams || {})
      : () => false;

    return (
      <TouchableOpacity
        key={item.text()}
        onPress={onPressAction}
        style={{
          ...styles.sectionContainer,
          flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
        }}
      >
        <View
          style={{
            flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
            alignItems: 'center',
          }}
        >
          {Boolean(item.icon) && item.icon()}
          <Text
            style={{
              ...styles.sectionText,
              marginLeft: i18n.locale.toLowerCase() == 'en' ? (Boolean(item.icon) ? 10 : 0) : 10,
              marginRight: i18n.locale.toLowerCase() == 'en' ? 10 : Boolean(item.icon) ? 10 : 0,
            }}
          >
            {item.text()}
          </Text>
        </View>
        <Icon
          name={i18n.locale.toLowerCase() == 'en' ? 'angle-right' : 'angle-left'}
          color="#6D6E71"
          size={22}
        />
      </TouchableOpacity>
    );
  };

  renderListFooterComponent = () => {
    const { isAuthorized } = this.state;

    if (!isAuthorized) {
      return null;
    }

    return (
      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity
          style={{
            ...styles.logoutButton,
            flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
          }}
          onPress={this.logOutUser}
        >
          <Icon name="sign-out" color={colorConstants.themeColor} size={16} />
          <Text
            style={{
              ...styles.logoutButtonText,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
              marginLeft: i18n.locale.toLowerCase() == 'en' ? 5 : 0,
              marginRight: i18n.locale.toLowerCase() == 'en' ? 0 : 5,
            }}
          >
            {constants.logoutButtonText()}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { isAuthorized, accountDetails, accountBalance, isLoading } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    return (
      <View style={styles.container}>
        {!isAuthorized && (
          <View style={styles.loginContainer}>
            <Text style={styles.welcomeText}>{constants.welcomeMessage()}</Text>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                style={styles.greenButton}
              >
                <Text style={styles.greenButtonText}>{constants.signInButtonText()}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                style={styles.greenButtonRegister}
              >
                <Text style={styles.greenButtonRegisterText}>{constants.registerButtonText()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <SectionList
          contentContainerStyle={styles.sectionListContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => this.renderItem(item)}
          renderSectionHeader={this.renderSectionHeader}
          stickySectionHeadersEnabled={false}
          sections={constants.sections}
          keyExtractor={item => item.text()}
          ListHeaderComponent={
            accountDetails && (
              <AccountDetails
                fullName={accountDetails.name}
                image={accountDetails.image}
                accountBalance={accountBalance}
              />
            )
          }
          ListFooterComponent={this.renderListFooterComponent}
        />
        {this.modalLanguage()}
      </View>
    );
  }
}

MoreScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default MoreScreen;
