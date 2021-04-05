import React from 'react';
import { WebView } from 'react-native-webview';
import { NavHeaderUser } from '../../components/NavHeaderUser';
import i18n from '../../../i18n';

const View360Screen = ({ navigation }) => {
  return (
    <WebView
      source={{
        uri: navigation.getParam('uri'),
        //uri: 'https://pandaanalytics.com'
        //uri: 'http://hi360v.com/ru/googlepano/38-google/183-carpetworld'
        //uri: 'https://staging01.dxbsports.com'
        //uri: 'https://staging01.dxbsports.com/venues/view360/embed/17'
        //uri: 'https://staging01.dxbsports.com/venues/view360/17'
      }}
      startInLoadingState={true}
      onError={syntheticEvent => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      }}
      onLoad={syntheticEvent => {
        const { nativeEvent } = syntheticEvent;

        console.log('WebView Load: ', nativeEvent.url);
      }}
      onLoadEnd={syntheticEvent => {
        const { nativeEvent } = syntheticEvent;

        console.log('WebView LoadEnd: ', nativeEvent.loading);
      }}
      onLoadStart={syntheticEvent => {
        const { nativeEvent } = syntheticEvent;

        console.log('WebView LoadStart: ', nativeEvent.loading);
      }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      automaticallyAdjustContentInsets={true}
      scalesPageToFit={true}
      allowFileAccess={true}
      allowFileAccessFromFileURLs={true}
      allowUniversalAccessFromFileURLs={true}
      originWhitelist={['*']}
      //mixedContentMode="compatibility"
      mixedContentMode="always"
      cacheEnabled={true}
      useWebKit={true}
      allowsFullscreenVideo={true}
    />
  );

  //return (<WebView source={{ uri: 'https://habr.com/ru/company/sberbank/blog/440710/' }} />);
};

View360Screen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: <NavHeaderUser {...navigation} />,
    title: i18n.t('more.360view'),
  };
};

export default View360Screen;
