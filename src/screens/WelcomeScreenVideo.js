import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Video from 'react-native-video';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import introVideo from '../assets/videos/intro.mp4';
import SwipeGesture from '../components/SwipeGesture';

import i18n from '../../i18n';

FontBreeBold = Platform.OS === 'ios' ? 'bree-bold' : 'BreeBold';
FontBreeRegular = Platform.OS === 'ios' ? 'bree-regular' : 'BreeRegular';

export default class WelcomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    currentText: '',
    isSLiderActive: true,
    user: {},
    slidingText: [
      i18n.t('welcome.sliding_text_1'),
      i18n.t('welcome.sliding_text_2'),
      i18n.t('welcome.sliding_text_3'),
    ],
  };

  _handleVideoRef = component => {
    const playbackObject = component;
  };

  constructor() {
    super();
  }

  onSwipePerformed = action => {
    switch (action) {
      case 'left': {
        this._scrollSlider('left');
      }
      case 'right': {
        this._scrollSlider('right');
      }
    }
  };

  _scrollSlider(direction) {
    this.setState(
      {
        isSLiderActive: false,
      },
      () => {
        index = this.state.slidingText.indexOf(this.state.currentText);
        newText = '';

        if (direction == 'right' && this.state.slidingText[index + 1]) {
          newText = this.state.slidingText[index + 1];
        }
        if (direction == 'right' && !this.state.slidingText[index + 1]) {
          newText = this.state.slidingText[0];
        }

        if (direction == 'left' && this.state.slidingText[index - 1]) {
          newText = this.state.slidingText[index - 1];
        }
        if (direction == 'left' && !this.state.slidingText[index - 1]) {
          newText = this.state.slidingText[this.state.slidingText.length - 1];
        }

        // alert(direction + '/' + newText + '/'+ this.state.currentText);

        this.setState({
          currentText: newText,
        });
      }
    );
  }

  async componentWillMount() {
    if (false && __DEV__) {
      this.props.navigation.navigate('Home', {
        isSkipped: false,
      });

      return true;
    }
  }

  async componentDidMount() {
    const storedValue = await AsyncStorage.getItem('app:user');

    this.setState(
      {
        slidingText: [
          i18n.t('welcome.sliding_text_1'),
          i18n.t('welcome.sliding_text_2'),
          i18n.t('welcome.sliding_text_3'),
        ],
      },
      () => {
        this.setState({
          currentText: this.state.slidingText[0],
        });
      }
    );

    if (storedValue) {
      this.setState({
        user: JSON.parse(storedValue),
      });
    } else {
      this.setState({
        user: {
          name: '',
          email: '',
          country: 0,
          language: 0,
          phone: '',
          token: '',
        },
      });
    }
  }

  componentWillUnmount() {}

  _onPlaybackStatusUpdate = currentTime => {
    if (!this.state.isSLiderActive) {
      return;
    }

    if (currentTime.currentTime * 1000 >= 0 && currentTime.currentTime * 1000 < 6000) {
      this.setState({
        currentText: this.state.slidingText[0],
      });
    }

    if (currentTime.currentTime * 1000 >= 6000 && currentTime.currentTime * 1000 <= 12000) {
      this.setState({
        currentText: this.state.slidingText[1],
      });
    }

    if (currentTime.currentTime * 1000 >= 12000) {
      this.setState({
        currentText: this.state.slidingText[2],
      });
    }
  };

  render() {
    return (
      <View>
        <SwipeGesture
          gestureStyle={styles.swipesGestureContainer}
          onSwipePerformed={this.onSwipePerformed}
        >
          <View style={styles.container}>
            <Video
              ref={this._handleVideoRef}
              source={introVideo}
              rate={1.0}
              volume={0.7}
              onProgress={currentTime => this._onPlaybackStatusUpdate(currentTime)}
              isMuted={false}
              resizeMode="contain"
              useNativeControls={false}
              paused={false}
              repeat
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                minWidth: Dimensions.get('window').width,
                minHeight: Dimensions.get('window').height,
              }}
            />

            <View style={{ position: 'absolute', bottom: 200 }}>
              <View style={{ paddingLeft: 70, paddingRight: 70 }}>
                <Text style={styles.sliderText}>{this.state.currentText}</Text>

                <View
                  style={{
                    marginTop: 20,
                    marginBottom: -5,
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FontAwesome
                    name="circle"
                    size={11}
                    color={
                      this.state.currentText == this.state.slidingText[0] ? '#ffffff' : '#aeadab'
                    }
                  />
                  <FontAwesome
                    name="circle"
                    size={11}
                    color={
                      this.state.currentText == this.state.slidingText[1] ? '#ffffff' : '#aeadab'
                    }
                    style={{ marginLeft: 10 }}
                  />
                  <FontAwesome
                    name="circle"
                    size={11}
                    color={
                      this.state.currentText == this.state.slidingText[2] ? '#ffffff' : '#aeadab'
                    }
                    style={{ marginLeft: 10 }}
                  />
                </View>
              </View>
            </View>

            <View style={{ position: 'absolute', bottom: 80 }}>
              <TouchableOpacity onPress={this._handleGetStarted} style={styles.GetStartedButton}>
                <Text
                  style={{
                    fontFamily: FontBreeBold,
                    fontSize: 20,
                    color: '#F7F7F7',
                  }}
                >
                  {i18n.t('welcome.get_started')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SwipeGesture>
      </View>
    );
  }

  _handleGetStarted = () => {
    if (this.state.user.token) {
      this.props.navigation.navigate('Home', {
        isSkipped: false,
      });
    } else {
      AsyncStorage.setItem('app:user', JSON.stringify(this.state.user));

      this.props.navigation.navigate('AuthChoice', {
        isSkipped: false,
      });
    }
  };
}

const styles = StyleSheet.create({
  GetStartedButton: {
    padding: 22,
    // borderWidth: 2,
    // borderColor: '#2F8C83',
    alignItems: 'center',
    backgroundColor: '#06a09a',
    borderRadius: 5,
    paddingLeft: 70,
    paddingRight: 70,
    flex: 1,
  },
  backgroundVideo: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
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
  sliderText: {
    color: '#ffffff',
    fontFamily: FontBreeBold,
    fontSize: 25,
    textAlign: 'center',
  },
  swipesGestureContainer: {
    height: '100%',
    width: '100%',
  },
});
