import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, View, Linking, Text } from 'react-native';
import env from '../../config';
import { NavHeaderUser } from '../../components/NavHeaderUser';
import i18n from '../../../i18n';
import colors from '../../constants/colors';
import { fontFamily } from '../../constants/fonts';
import { htmlStyles } from '../../constants/htmlRendering';
import HTML from 'react-native-render-html';

/**
 * @param {object} navigation
 * @param {'privacy-policy' | 'terms-of-use' | 'refund-policy'} constraint
 * @constructor
 */

const PolicyScreen = ({ navigation }) => {
  const [html, setHTML] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const constraint = navigation.getParam('constraint');
  const language = i18n.locale;

  useEffect(() => {
    fetch(`${env.api}/api/page/${constraint}?langCode=${language}`)
      .then(res => res.json())
      .then(res => {
        setHTML(res.Content);
        setIsLoading(false);
      });
  });

  return isLoading ? (
    <ActivityIndicator size="large" style={{ flex: 1 }} />
  ) : (
    <View style={{ flex: 1, backgroundColor: colors.primaryBgColor }}>
      <ScrollView
        style={{
          flex: 1,
          marginTop: 16,
          marginBottom: 16,
          marginHorizontal: 15,

          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: '#fff',

          paddingHorizontal: 15,
          paddingTop: 16,
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <HTML
          html={html}
          renderers={{
            a: (htmlAttribs, children, convertedCSSStyles, passProps) => {
              if (htmlAttribs.href) {
                return (
                  <Text
                    key={Date.now() + '-' + Math.random(htmlAttribs.href.length)}
                    onPress={() => Linking.openURL(htmlAttribs.href)}
                  >
                    {children}
                  </Text>
                );
              }
            },
          }}
          baseFontStyle={{
            textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
          }}
          tagsStyles={{
            ...htmlStyles,
            img: {
              maxWidth: '100%',
              marginTop: 4,
              marginBottom: 4,
            },
          }}
        />
      </ScrollView>
    </View>
  );
};

PolicyScreen.navigationOptions = ({ navigation }) => {
  const constraint = navigation.getParam('constraint');
  const isSignUp = navigation.getParam('isSignUp');

  return {
    headerRight: isSignUp ? null : <NavHeaderUser {...navigation} />,
    title:
      constraint === 'terms-of-use'
        ? i18n.t('more.terms_of_use')
        : constraint === 'privacy-policy'
        ? i18n.t('more.privacy_policy')
        : constraint === 'refund-policy'
        ? i18n.t('more.refund_policy')
        : '',
  };
};

export default PolicyScreen;
