import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  NativeSyntheticEvent,
  Alert,
  Modal,
  TouchableOpacity,
  ViewStyle,
  Image,
  ImageBackground,
} from 'react-native';

import UnityView, { MessageHandler, UnityModule } from 'react-native-unity-view';
import { WebView } from 'react-native-webview';
// import { WebViewNativeEvent } from 'react-native-webview/lib/WebViewTypes';
import Svg, { G, Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Button from '../components/ButtonPrimary';

import i18n from '../../i18n';

const CameraIcon = props => (
  <Svg width={141} height={141} {...props}>
    <G data-name="camera icon" transform="translate(-137 -227)">
      <Circle
        data-name="Ellipse 68"
        cx={70.5}
        cy={70.5}
        r={70.5}
        transform="translate(137 227)"
        fill="#b1b3b6"
        opacity={0.696}
      />
      <G data-name={35422}>
        <G data-name="Group 588" fill="#fff4f4">
          <Path
            data-name="Path 322"
            d="M241.757 268.235a1.6 1.6 0 0 1-1.494-1.694v-6.97a5.092 5.092 0 0 0-5.083-5.084H203.7a5.093 5.093 0 0 0-5.085 5.084v6.063a2.255 2.255 0 0 1-1.656 2.042 12.949 12.949 0 0 0-7.81 6.606 4.562 4.562 0 0 1-2.311 2 17.7 17.7 0 0 0-8.713 6.1L163.3 303.833a46.881 46.881 0 0 0-6.041 12.867l-1.2 4.982a1.552 1.552 0 0 0 .917 1.962 1.551 1.551 0 0 0 1.708-1.331l1.2-4.978a43.691 43.691 0 0 1 5.642-11.96l14.815-21.456a14.964 14.964 0 0 1 10.985-5.761h22.388a4.046 4.046 0 0 1 4.042 4.042v.844a4.047 4.047 0 0 1-4.043 4.042h-20.327a1.35 1.35 0 0 0 0 2.7h3.533a1.694 1.694 0 0 1 1.693 1.694v.41a11.1 11.1 0 0 1-.538 3.3c-4.959 13.068-20.493 15.01-21.234 15.094a1.347 1.347 0 0 0-1.194 1.489 1.35 1.35 0 0 0 1.354 1.2l.139-.01c.174-.018 13.312-1.625 20.526-11.459.553-.754.95-.642.95.293v22.514a5.047 5.047 0 0 0 1.593 3.689c.68.642.808 1.411.032 1.935a28.4 28.4 0 0 1-15.849 4.518 26.251 26.251 0 0 1-3.976-.271 1.13 1.13 0 0 0-.945.258 1.145 1.145 0 0 0-.408.88v4.157a1.157 1.157 0 0 0 2.315 0v-1.433a1.3 1.3 0 0 1 1.323-1.355c.4.015.847.025 1.326.025 5.049 0 12.779-1.025 19.268-6.217a5.548 5.548 0 0 1 2.978-1.1h28.9a5.1 5.1 0 0 0 5.083-5.088V309.98a1.6 1.6 0 0 1 1.493-1.694h1.493c2.62 0 4.753-2.533 4.753-5.649v-.45a6.279 6.279 0 0 0-.842-3.181 2.606 2.606 0 0 1 0-2.623A6.3 6.3 0 0 0 248 293.2v-.45a6.3 6.3 0 0 0-.842-3.182 2.61 2.61 0 0 1 0-2.624 6.3 6.3 0 0 0 .842-3.179v-.45a6.284 6.284 0 0 0-.842-3.181 2.6 2.6 0 0 1 0-2.621 6.3 6.3 0 0 0 .842-3.181v-.45c0-3.116-2.132-5.649-4.753-5.649.006.002-.663.002-1.49.002zm-36.5 21.544h8.459a6.747 6.747 0 0 0 6.742-6.74v-.839a6.748 6.748 0 0 0-6.742-6.738h-8.461a1.694 1.694 0 0 1-1.693-1.693v-8.327a1.694 1.694 0 0 1 1.693-1.693h28.365a1.694 1.694 0 0 1 1.694 1.693V317.9a1.694 1.694 0 0 1-1.694 1.69h-28.365a1.694 1.694 0 0 1-1.693-1.69v-26.428a1.694 1.694 0 0 1 1.693-1.693zm29.923 37.63H203.7a3.1 3.1 0 0 1-3.095-3.1v-26.45a6.981 6.981 0 0 0-.069-1.54c-.039.083.218-.554.5-1.443a25.512 25.512 0 0 0 .835-3.417c.159-.922.338-1.677.466-1.677s.23.759.23 1.694v28.611a.5.5 0 0 0 .5.5h32.745a.5.5 0 0 0 .5-.5v-56.834a.5.5 0 0 0-.5-.5h-32.748a.5.5 0 0 0-.5.5v10.511a1.694 1.694 0 0 1-1.694 1.693h-7.655c-.935 0-1.37-.691-.818-1.446a9.891 9.891 0 0 1 6.479-4.011c.923-.145 1.688-.7 1.688-1.4s.02-2.028.026-2.964c.014-2.284.014-6.069.014-6.069a3.1 3.1 0 0 1 3.094-3.1h31.484a3.1 3.1 0 0 1 3.095 3.1v64.743a3.1 3.1 0 0 1-3.097 3.099zm8.072-21.44h-1.219c-.674 0-1.219-.759-1.219-1.694v-3.73c0-.935.545-1.694 1.219-1.694h1.219c1.344 0 2.437 1.5 2.437 3.335v.45c.001 1.838-1.089 3.334-2.436 3.334zm0-9.434h-1.219c-.674 0-1.219-.759-1.219-1.694v-3.733c0-.935.545-1.694 1.219-1.694h1.219c1.344 0 2.437 1.5 2.437 3.338v.45c.001 1.838-1.089 3.333-2.436 3.333zm0-9.436h-1.219c-.674 0-1.219-.759-1.219-1.694v-3.73c0-.935.545-1.694 1.219-1.694h1.219c1.344 0 2.437 1.5 2.437 3.335v.45c.001 1.834-1.089 3.334-2.436 3.334zm0-9.433h-1.219c-.674 0-1.219-.759-1.219-1.694v-3.732c0-.935.545-1.694 1.219-1.694h1.219c1.344 0 2.437 1.5 2.437 3.338v.451c.001 1.836-1.089 3.332-2.436 3.332z"
          />
          <Path
            data-name="Path 323"
            d="M222.234 258.738h-5.59a.5.5 0 0 0 0 1h5.589a.5.5 0 0 0 0-1z"
          />
          <Path
            data-name="Path 324"
            d="M222.301 321.718h-5.728a2.136 2.136 0 0 0-2.133 2.13v.344a2.139 2.139 0 0 0 2.133 2.134h5.726a2.139 2.139 0 0 0 2.136-2.134v-.341a2.139 2.139 0 0 0-2.134-2.133zm1.136 2.474a1.139 1.139 0 0 1-1.138 1.139h-5.726a1.14 1.14 0 0 1-1.138-1.139v-.341a1.139 1.139 0 0 1 1.139-1.137h5.726a1.138 1.138 0 0 1 1.138 1.137z"
          />
        </G>
      </G>
    </G>
  </Svg>
);

const SvgCloseButton = props => (
  <Svg width={28} height={28} {...props}>
    <G data-name="close button" transform="translate(-33 -320)">
      <Circle
        data-name="Ellipse 103"
        cx={14}
        cy={14}
        r={14}
        transform="translate(33 320)"
        fill="#2f8c83"
      />
      <G data-name="Group 3154">
        <Path
          data-name="Path 3480"
          d="M53 329.2l-1.2-1.2-4.8 4.8-4.8-4.8-1.2 1.2 4.8 4.8-4.8 4.8 1.2 1.2 4.8-4.8 4.8 4.8 1.2-1.2-4.8-4.8zm0 0"
          fill="#fff"
        />
      </G>
    </G>
  </Svg>
);

const Bottom = props => (
  <View
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 70,
    }}
  >
    <Image
      style={{
        position: 'absolute',
        bottom: -20,
        left: -40,
        width: '120%',
        height: 70,
      }}
      source={require('../assets/images/heading_bgr.png')}
      resizeMode="stretch"
    />
    <Text
      style={{
        color: '#fff',
        alignSelf: 'center',
        bottom: -40,
        fontWeight: 'bold',
      }}
    >
      {'News and Lifestyle from Dubai'}
    </Text>
  </View>
);

export default class ARScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickCount: 0,
      renderUnity: true,
      unityPaused: false,
      modalVisible: false,
      uri: 'https://google.com',
    };
  }

  componentDidMount() {
    StatusBar.setHidden(false);
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('rgba(255,255,255,0)');
      StatusBar.setTranslucent(true);
    }
  }

  onToggleUnity() {
    this.setState({ renderUnity: !this.state.renderUnity });
  }

  onPauseAndResumeUnity() {
    if (this.state.unityPaused) {
      UnityModule.resume();
    } else {
      UnityModule.pause();
    }
    this.setState({ unityPaused: !this.state.unityPaused });
  }

  onUnityMessage(hander) {
    this.setState({ clickCount: this.state.clickCount + 1 });
    // Alert.alert('UnityMessage', hander.name +" : "+ hander.data.id);
    if (this.state.modalVisible == false) {
      if (hander.name == 'TrackingFound') {
        if (hander.data.id == 'Page_11_1') {
          this.showCustom('https://www.youtube.com/embed/k6FVz6ite8Q');
        } else if (hander.data.id == 'Page_12_1') {
          this.showCustom('https://www.youtube.com/embed/5DF5vywiwf4');
        } else if (hander.data.id == 'Page_13_1') {
          this.showCustom('https://www.youtube.com/embed/k0MCuTRyXhc');
        } else if (hander.data.id == 'Page_14_1') {
          this.showCustom('https://www.youtube.com/embed/DOoTp5hMpNI');
        } else if (hander.data.id == 'Page_15_1') {
          this.showCustom('https://www.youtube.com/embed/k0MCuTRyXhc');
        }
        // b
        else if (hander.data.id == 'Page_18_1') {
          this.showCustom('https://www.youtube.com/embed/OcArFz-YQhg');
        } else if (hander.data.id == 'Page_20_1') {
          this.showCustom('https://www.youtube.com/embed/WOrcUt_Q5T8');
        } else if (hander.data.id == 'Page_21_1') {
          this.showCustom('https://www.youtube.com/embed/h62QipeG74Y');
        } else if (hander.data.id == 'Page_24_1') {
          this.showCustom('https://www.youtube.com/embed/DB8SgjY3vAk');
        } else if (hander.data.id == 'Page_27_1') {
          this.showCustom('https://www.youtube.com/embed/k9qpehcmbbY');
        } else if (hander.data.id == 'Page_28_1') {
          this.showCustom('https://www.youtube.com/embed/vY1tgYxRt5c');
        } else if (hander.data.id == 'Page_30_1') {
          this.showCustom('https://www.youtube.com/embed/k0MCuTRyXhc');
        }
        // b
        else if (hander.data.id == 'Page_31_1') {
          this.showCustom('https://www.youtube.com/embed/MLwDasaDgYw');
        } else if (hander.data.id == 'Page_32_1') {
          this.showCustom('https://www.youtube.com/embed/exncYIGXiak');
        } else if (hander.data.id == 'Page_33_1') {
          this.showCustom('https://www.youtube.com/embed/tK6_IQhBmZQ');
        } else if (hander.data.id == 'Page_34_1') {
          this.showCustom('https://www.youtube.com/embed/uiWWH5mA4qI');
        } else if (hander.data.id == 'Page_35_1') {
          this.showCustom('https://www.youtube.com/embed/SD2cdi_ECZQ');
        } else if (hander.data.id == 'Page_39_1') {
          this.showCustom('https://www.youtube.com/embed/jbcBeWW_XvA');
        } else if (hander.data.id == 'Page_42_1') {
          this.showCustom('https://www.youtube.com/embed/4viBS60WGfQ');
        } else if (hander.data.id == 'Page_43_1') {
          this.showCustom('https://www.youtube.com/embed/ddX--EHzU9o');
        } else if (hander.data.id == 'Page_44_1') {
          this.showCustom('https://www.youtube.com/embed/BJ8fngAc46g');
        } else if (hander.data.id == 'Page_45_1') {
          this.showCustom('https://www.youtube.com/embed/JynLXrUlZc0');
        } else if (hander.data.id == 'Page_46_1') {
          this.showCustom('https://www.youtube.com/embed/dLp-o0oWWFw');
        } else if (hander.data.id == 'Page_47_1') {
          this.showCustom('https://www.youtube.com/embed/R3DdGO65wMI');
        } else if (hander.data.id == 'Page_51_1') {
          this.showCustom('https://www.youtube.com/embed/6D_Sdfwqilc');
        } else if (hander.data.id == 'Page_52_1') {
          this.showCustom('https://www.youtube.com/embed/u9EeA1yTjfY ');
        }
      }
    }
  }

  _onNavigationStateChange(webViewState) {
    // this.hide()
  }

  show() {
    this.setState({ modalVisible: true });
  }

  showCustom(url) {
    this.setState({ modalVisible: true, uri: url });
  }

  hide() {
    this.setState({ modalVisible: false });
  }

  render() {
    const { renderUnity } = this.state;
    let unityElement;
    // let unityElement: JSX.Element;

    if (renderUnity) {
      unityElement = (
        <UnityView
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
          onUnityMessage={this.onUnityMessage.bind(this)}
        />
      );
    }

    return (
      <View style={[styles.container]}>
        {unityElement}
        <CameraIcon />
        {!renderUnity ? (
          <Button
            label="Turn on AR"
            style={styles.button}
            onPress={this.onToggleUnity.bind(this)}
          />
        ) : null}
        {/* {!renderUnity ? <Button label="View" style={styles.button} onPress={this.show.bind(this)} /> :
                       <Button label="View" style={styles.button} onPress={this.showCustom.bind(this,'https://www.youtube.com/embed/c7qO-LhA2MM')} />} */}
        {renderUnity ? (
          <Text style={{ color: '#fff', margin: 20, fontWeight: 'bold' }}>Point A Camera</Text>
        ) : null}
        <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={this.hide.bind(this)}
          transparent
        >
          <View style={styles.modalWarp}>
            <TouchableOpacity onPress={this.hide.bind(this)} style={styles.button}>
              <SvgCloseButton style={styles.closeStyle} />
            </TouchableOpacity>
            <WebView
              // style={{ }}
              source={{ uri: this.state.uri }}
              // scalesPageToFit
              startInLoadingState
              onNavigationStateChange={this._onNavigationStateChange.bind(this)}
              onError={this._onNavigationStateChange.bind(this)}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  WebViewContainer: {
    marginTop: Platform.OS == 'ios' ? 20 : 0,
  },
  backgroundContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  button: {
    marginTop: 10,
  },
  closeStyle: {
    alignSelf: 'flex-end',
    // position: 'absolute', right: 0,
    // marginTop: 10
    marginTop: -10,
    marginLeft: -5,
  },
  container: {
    // flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    // backgroundColor: '#000000',
    // height: 300,
  },
  logo: {
    // position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    marginTop: 0,
    marginLeft: 0,
    // marginTop: 20,
    // marginBottom: 20,
    // flex: 1
  },
  modalWarp: {
    // display: 'table',
    // position: 'absolute',// top: 0, left: 0,
    // left: '50%',
    // top: '50%',
    // flex: 1,
    // //justifyContent: 'center',
    // //alignItems: 'center',
    // width: '90%',
    // height: '90%',
    flex: 1,
    margin: 20,
    backgroundColor: '#FFFCFF',
  },
  welcome: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
});
