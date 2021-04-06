import React from 'react'

import { View, FlatList, Text, TouchableOpacity, ImageBackground, Dimensions } from 'react-native'

import { withNavigation } from 'react-navigation'
import SkewedContainer from '../../../../components/SkewedContainer'
import colors from '../../../../constants/colors'
import styles from './styles'
import getSportsIcon from '../../../../helpers/sportsIconMapper'
import i18n from '../../../../../i18n'

import ParallelogramImage from '../../../../assets/images/parallelogram.png'
import Icon from '../../../../components/Icon'

let scrollTimer = null
const scrollDelay = 250

class EventCategoriesList extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    categoriesFull: this.props.eventCategories,
    categories: this.props.eventCategories.slice(0, 3),
    pageIndex: 0,
    screenWidth: Math.round(Dimensions.get('window').width)
  }

  windowDimensions() {
    this.setState({
      screenWidth: Dimensions.get('window').width
    })
  }

  componentDidMount() {
    Dimensions.addEventListener('change', () => this.windowDimensions())
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', () => this.windowDimensions())
  }

  scrollInfinityBack() {
    scrollTimer = setInterval(() => this.scrollBack(), scrollDelay)
  }

  scrollInfinityForward() {
    scrollTimer = setInterval(() => this.scrollForward(), scrollDelay)
  }

  clearScroll() {
    scrollTimer && clearInterval(scrollTimer)
  }

  scrollBack() {
    let pageIndex = this.state.pageIndex - 3
    if (pageIndex < 0) {
      pageIndex = 0
    }

    this.setState({
      pageIndex: pageIndex,
      categories: this.state.categoriesFull.slice(pageIndex, pageIndex + 3)
    })
  }

  scrollForward() {
    let pageIndex = this.state.pageIndex + 3
    if (pageIndex < 0) {
      pageIndex = 0
    }

    if (pageIndex > this.state.categoriesFull.length) {
      return
    }

    this.setState({
      pageIndex: pageIndex,
      categories: this.state.categoriesFull.slice(pageIndex, pageIndex + 3)
    })
  }

  render() {
    const { screenWidth } = this.state

    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.headingLabel}>{i18n.t('event_categories.sports_categories')}</Text>

        <View style={{ width: '100%', height: 64, marginTop: 10 }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              textAlign: 'left',
              paddingTop: 24,
              paddingLeft: 10,
              zIndex: 999999999
            }}
            onPress={() => {
              this.scrollBack()
            }}
            onLongPress={() => {
              this.scrollInfinityBack()
            }}
            onPressOut={() => {
              this.clearScroll()
            }}
          >
            {Icon.getIcon(Icon.iconLibraries.fontAwesome, 'chevron-left', {
              size: 20,
              color: '#202873'
            })}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.scrollBack()
            }}
            onLongPress={() => {
              this.scrollInfinityBack()
            }}
            onPressOut={() => {
              this.clearScroll()
            }}
            style={[
              {
                width: 80,
                height: 64,
                position: 'absolute',
                left: 0
              }
            ]}
          >
            <SkewedContainer backgroundColor="rgba(255,255,255,0.6)" rightSkewType="desc" isFullWidth height={64} />
          </TouchableOpacity>

          {this.state.categories.map((item, index) => {
            let left = 24 + ((screenWidth - 52 * 2) / 3) * index

            // console.log( item.Id, item.NameInPrimaryLang )

            return (
              <View
                key={index.toString()}
                style={[
                  styles.itemMainBox,
                  {
                    width: (screenWidth + 64) / 3,
                    height: 64,
                    position: 'absolute',
                    left: left
                  }
                ]}
              >
                <SkewedContainer
                  backgroundColor="rgba(255,255,255,0.6)"
                  leftSkewType="desc"
                  rightSkewType="desc"
                  isFullWidth
                  height={64}
                />
                <TouchableOpacity
                  style={styles.itemMain}
                  onPress={() =>
                    this.props.navigation.navigate('HeaderSearch', {
                      searchForm: {
                        id: item.NameInPrimaryLang,
                        object: item,
                        isHomeCategory: true
                      }
                    })
                  }
                >
                  {/*
                  <ImageBackground
                    source={ParallelogramImage}
                    style={{
                      width: screenWidth / 3,
                      height: 64,
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: 10,
                    }}
                    resizeMode="stretch"
                  >
                */}
                  {getSportsIcon(item.Id, { width: 24, height: 24 })}
                  <Text ellipsizeMode="tail" numberOfLines={1} style={styles.itemText}>
                    {item.NameInPrimaryLang}
                  </Text>
                  {/*
                  </ImageBackground>
                */}
                </TouchableOpacity>
              </View>
            )
          })}

          <TouchableOpacity
            onPress={() => {
              this.scrollForward()
            }}
            onLongPress={() => {
              this.scrollInfinityForward()
            }}
            onPressOut={() => {
              this.clearScroll()
            }}
            style={[
              {
                width: 80,
                height: 64,
                position: 'absolute',
                right: 0
              }
            ]}
          >
            <SkewedContainer backgroundColor="rgba(255,255,255,0.6)" leftSkewType="desc" isFullWidth height={64} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              paddingTop: 24,
              paddingRight: 10,
              textAlign: 'right',
              zIndex: 999999999
            }}
            onPress={() => {
              this.scrollForward()
            }}
            onLongPress={() => {
              this.scrollInfinityForward()
            }}
            onPressOut={() => {
              this.clearScroll()
            }}
          >
            {Icon.getIcon(Icon.iconLibraries.fontAwesome, 'chevron-right', {
              size: 20,
              color: '#202873'
            })}
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default withNavigation(EventCategoriesList)
