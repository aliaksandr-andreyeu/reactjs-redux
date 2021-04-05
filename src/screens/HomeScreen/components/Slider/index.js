import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { withNavigation } from 'react-navigation';
import SwipeGesture from '../../../../components/SwipeGesture';
import SkewedContainer from '../../../../components/SkewedContainer';
import colors from '../../../../constants/colors';
import styles from './styles';
import HomeLine from '../../../../assets/images/HomeLine.png';
import SigninBgImage from '../../../../assets/images/signInBg.jpg';
import { fontFamily, fontSize } from '../../../../constants/fonts';
import Icon from '../../../../components/Icon';
import i18n from '../../../../../i18n';

import getLocaleDate from '../../../../helpers/getLocaleDate';
import { getLocalePeriod, getLocalePeriodWithYear } from '../../../../helpers/getLocalePeriod';

class Slider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
      dataBoxHeight: 0,
      dimensions: {
        window: Dimensions.get('window'),
        screen: Dimensions.get('screen'),
      },
    };

    this.sliderInterval = setInterval(() => {
      this.autoScrollSlider();
    }, 3000);
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.onChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onChange);

    clearInterval(this.sliderInterval);
  }

  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } });
  };

  setSliderInterval() {
    this.sliderInterval = setInterval(() => {
      this.autoScrollSlider();
    }, 3000);
  }

  clearSliderInterval() {
    clearInterval(this.sliderInterval);
  }

  onSwipePerformed = action => {
    switch (action) {
      case 'left': {
        this._scrollSlider('left');
        break;
      }
      case 'right': {
        this._scrollSlider('right');
        break;
      }
    }
  };

  autoScrollSlider() {
    const { slides } = this.props;
    const { currentSlide } = this.state;

    let newIndex = 0;

    newIndex = slides[currentSlide + 1] ? currentSlide + 1 : 0;

    this.setState({
      currentSlide: newIndex,
    });
  }

  _scrollSlider(direction) {
    const { slides } = this.props;
    const { currentSlide } = this.state;

    this.clearSliderInterval();

    let newIndex = currentSlide;

    if (direction === 'right') {
      newIndex = slides[currentSlide - 1] ? currentSlide - 1 : currentSlide;
    } else if (direction === 'left') {
      newIndex = slides[currentSlide + 1] ? currentSlide + 1 : currentSlide;
    }

    this.setState(
      {
        currentSlide: newIndex,
      },
      () => {
        this.setSliderInterval();
      }
    );
  }

  _slideRight() {
    const { slides } = this.props;
    const { currentSlide } = this.state;

    this.clearSliderInterval();

    let newIndex = slides[currentSlide + 1] ? currentSlide + 1 : 0;

    this.setState(
      {
        currentSlide: newIndex,
      },
      () => {
        this.setSliderInterval();
      }
    );
  }

  _slideLeft() {
    const { slides } = this.props;
    const { currentSlide } = this.state;

    this.clearSliderInterval();

    let newIndex = slides[currentSlide - 1] ? currentSlide - 1 : slides.length - 1;

    this.setState(
      {
        currentSlide: newIndex,
      },
      () => {
        this.setSliderInterval();
      }
    );
  }

  slidePressed() {
    const { slides, navigation } = this.props;
    const { currentSlide } = this.state;

    const slide = slides[currentSlide];

    if (slide.EntityName === 'Feature') {
      navigation.navigate('FeatureDetail', {
        id: slides[currentSlide].Id,
        object: slides[currentSlide],
      });
    } else if (slide.EntityName === 'News') {
      navigation.navigate('NewsDetail', {
        id: slides[currentSlide].Id,
        object: slides[currentSlide],
      });
    } else if (slide.EntityName === 'Event') {
      navigation.navigate('EventDetail', {
        id: slides[currentSlide].Id,
        object: slides[currentSlide],
      });
    }
  }

  _getDate = (item, itemEnd) => {
    const { dimensions } = this.state;

    // let date = itemEnd && itemEnd != item ? getLocalePeriodWithYear(item, itemEnd) : getLocaleDate(item);
    let date = itemEnd && itemEnd != item ? getLocalePeriod(item, itemEnd) : getLocaleDate(item);

    // console.log('date: ', date);

    return date ? <Text style={styles.date}>{date}</Text> : null;
  };

  render() {
    const { slides, navigation } = this.props;
    const { currentSlide, dataBoxHeight } = this.state;

    const deviceWidth = Dimensions.get('window').width;

    const slide = slides[currentSlide];

    const screenWidth = Dimensions.get('window').width;

    const { getIcon, iconLibraries } = Icon;

    // A randomly picked value of 400 serves as breakpoint to switch between a hexagon and a rectangle
    // The approach is widely known as a 'kostyl' and is likely to be removed as soon as the designs
    // are revisited and prudence prevails in the designer's head.
    // const shouldHexagonTransformToSquare = screenWidth < 400;

    const shouldHexagonTransformToSquare = false;

    const mainSkewedContainerEdgeType = shouldHexagonTransformToSquare ? '' : 'full';

    return (
      <View style={{ marginBottom: -(dataBoxHeight / 2) + 30 }}>
        <View>
          <Image
            style={[{ width: deviceWidth, height: 400 }]}
            resizeMode="cover"
            source={{ uri: slide.ImageSquareThumbURL }}
          />

          <View style={styles.triangle} />
          <Image source={HomeLine} style={styles.line} />

          <View
            onLayout={event => this.setState({ dataBoxHeight: event.nativeEvent.layout.height })}
            style={{ top: -(dataBoxHeight / 2) }}
          >
            <View style={styles.dotsContainer}>
              {slides.map((v, i) => (
                <View key={v.Id} style={[styles.dot, currentSlide === i && styles.dotSelected]} />
              ))}
            </View>
            <View style={styles.dataMain}>
              <SkewedContainer
                backgroundColor={colors.backgroundLight}
                leftSkewType={mainSkewedContainerEdgeType}
                rightSkewType={mainSkewedContainerEdgeType}
                isFullWidth
                height={180}
              >
                <View style={styles.dataContainer}>
                  <Text ellipsizeMode="tail" numberOfLines={2} style={styles.eventName}>
                    {slide.Title}
                  </Text>
                  {slide.EntityName === 'Feature' || slide.EntityName === 'News' ? null : (
                    <>
                      <View
                        style={{
                          flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                          justifyContent: 'flex-start',
                          marginBottom: 9,
                          alignItems: 'center',
                        }}
                      >
                        <View style={{ marginBottom: Platform.OS === 'ios' ? 0 : 4 }}>
                          {getIcon(iconLibraries.fontAwesome5, 'map-marker-alt', {
                            size: fontSize.small,
                            color: colors.darkIcon,
                          })}
                        </View>
                        <Text
                          style={{
                            ...styles.venueName,
                            marginLeft: i18n.locale.toLowerCase() == 'en' ? 8 : 0,
                            marginRight: i18n.locale.toLowerCase() == 'en' ? 0 : 8,
                          }}
                          numberOfLines={1}
                          adjustsFontSizeToFit={true}
                          ellipsizeMode="tail"
                        >
                          {slide.Venue}
                        </Text>
                      </View>
                      {this._getDate(slide.EventDate, slide.EndEventDate)}
                    </>
                  )}
                  <TouchableOpacity
                    style={styles.buttonBox}
                    onPress={() => {
                      this.slidePressed();
                    }}
                  >
                    <SkewedContainer
                      backgroundColor={colors.themeColor}
                      leftSkewType="desc"
                      rightSkewType="asc"
                      height={32}
                      // onLayout={event => console.log(event.nativeEvent.layout.height)}
                    >
                      <Text style={styles.buttonText}>
                        {slide.IsBookable ? i18n.t('home.buy_tickets') : i18n.t('home.read_more')}
                      </Text>
                    </SkewedContainer>
                  </TouchableOpacity>
                </View>
              </SkewedContainer>
              <View style={styles.leftButtonBox}>
                <TouchableOpacity
                  style={styles.leftButton}
                  activeOpacity={0.6}
                  onPress={() => {
                    this._slideLeft();
                  }}
                >
                  {getIcon(iconLibraries.entypo, 'chevron-thin-left', {
                    size: 54,
                    color: colors.themeColor,
                  })}
                </TouchableOpacity>
              </View>
              <View style={styles.rightButtonBox}>
                <TouchableOpacity
                  style={styles.rightButton}
                  activeOpacity={0.6}
                  onPress={() => {
                    this._slideRight();
                  }}
                >
                  {getIcon(iconLibraries.entypo, 'chevron-thin-right', {
                    size: 54,
                    color: colors.themeColor,
                  })}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default withNavigation(Slider);
