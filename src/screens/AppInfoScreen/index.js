import React from 'react';
import { View, Image, Text } from 'react-native';

import styles from './styles';
import { NavHeaderUser } from '../../components/NavHeaderUser';
import Logo from '../../assets/images/icons/dxb-logo.svg';

import { version } from '../../../package.json';

import i18n from '../../../i18n';

const AppInfo = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.containerBox}>
          <Logo height={120} width={120} />
          <Text
            style={{
              ...styles.version,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('appInfo.version')} {version}
          </Text>
        </View>

        <View style={styles.containerWrapper}>
          <Text
            style={{
              ...styles.description,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('appInfo.title')}
          </Text>
          <Text
            style={{
              ...styles.description,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('appInfo.desc')}
          </Text>
        </View>
      </View>
    </View>
  );
};

AppInfo.navigationOptions = ({ navigation }) => {
  return {
    headerRight: <NavHeaderUser {...navigation} />,
    title: i18n.t('more.app_info'),
  };
};

export default AppInfo;
