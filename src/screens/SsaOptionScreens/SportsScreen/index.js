import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import Dropdown from '../../../components/UI/Dropdown'
import styles from './styles'
import colors from '../../../constants/colors'
import SsaScreenTitle from '../components/SsaScreenTitle'
import * as actions from '../../SsaMainScreen/actions'
import { getValueById } from '../../../helpers/getValueById'
import ConfirmButtons from '../../../components/UI/ConfirmButtons'
import i18n from '../../../../i18n'
import isEqual from 'lodash.isequal'

class SportsScreen extends Component {
  constructor(props) {
    super(props)
    const { sportCategoryId, navigation } = props

    // console.log( 'sportCategoryId', sportCategoryId )

    this.state = {
      selectedCategory: sportCategoryId
    }

    //this.dropdownRef = React.createRef();

    this.sportCategories = navigation.getParam('sportCategories', [])
  }

  componentDidMount() {
    const { sportCategoryId } = this.props

    // console.log( 'componentDidMount sportCategoryId', sportCategoryId )

    this.setState({
      selectedCategory: sportCategoryId
    })
  }

  componentDidUpdate(prevProps) {
    const { sportCategoryId } = this.props

    // console.log( 'componentDidUpdate sportCategoryId', sportCategoryId )

    if (!isEqual(sportCategoryId, prevProps.sportCategoryId)) {
      this.setState({
        selectedCategory: sportCategoryId
      })
    }
  }

  selectCategory = id => {
    this.setState({
      selectedCategory: id
    })

    //}, () => this.dropdownRef.current.toggleDropdown()
  }

  renderSportsItem = (sports, index) => {
    const { selectedCategory } = this.state
    const isSelected = sports.Id === +selectedCategory

    // console.log(sports.Id == +selectedCategory)

    return (
      <TouchableOpacity
        key={sports.Id}
        style={{
          ...styles.sportsItem,
          ...(isSelected && {
            backgroundColor: colors.brandColorBright
          }),
          marginLeft: i18n.locale.toLowerCase() == 'en' ? 0 : 10,
          marginRight: i18n.locale.toLowerCase() == 'en' ? 10 : 0
        }}
        onPress={() => this.selectCategory(sports.Id)}
      >
        <Text
          style={{
            ...styles.sportsItemName,
            ...(isSelected && {
              color: colors.basicLightText
            })
          }}
        >
          {sports.NameInPrimaryLang}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { selectedCategory } = this.state
    const { changeCategory } = this.props

    // console.log( 'render selectedCategory', selectedCategory )

    return (
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
        <View style={styles.innerWrapper}>
          <SsaScreenTitle text={i18n.t('socialSportsActivity.sports')} />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: i18n.locale.toLowerCase() == 'en' ? 'flex-start' : 'flex-end'
              // borderWidth: 1,
              // borderColor: "#ff0000",
            }}
          >
            {this.sportCategories.map((item, index) => this.renderSportsItem(item, index))}
          </View>
        </View>
        {/*
        <View style={{ flex: 1 }}>
          <Dropdown
            ref={this.dropdownRef}
            title={
              selectedCategory >= 0
                ? getValueById(this.sportCategories, selectedCategory, 'NameInPrimaryLang')
                : i18n.t('socialSportsActivity.my_sports')
            }
            childrenContainerStyles={{ flexDirection: 'row', flexWrap: 'wrap' }}
          >
            {this.sportCategories.map(item => this.renderSportsItem(item))}
          </Dropdown>
        </View>
        */}
        <View>
          <ConfirmButtons
            confirmLabel={i18n.t('generic.buttons.apply')}
            cancelLabel={i18n.t('generic.buttons.clear')}
            closeOnCancel={false}
            handleCancel={() =>
              changeCategory({
                sportCategoryId: '',
                date: '',
                startTime: '',
                endTime: '',
                venueId: '',
                facilityId: '',
                packageId: ''
              })
            }
            handleSave={() =>
              changeCategory({
                sportCategoryId: selectedCategory.toString(),
                date: '',
                startTime: '',
                endTime: '',
                venueId: '',
                facilityId: '',
                packageId: ''
              })
            }
          />
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  sportCategoryId: state.socialSportActivity.sportCategoryId
})
const mapDispatchToProps = {
  changeCategory: actions.setData
}

SportsScreen.propTypes = {
  navigation: propTypes.shape({
    getParam: propTypes.func.isRequired
  }).isRequired,
  sportCategoryId: propTypes.string.isRequired,
  changeCategory: propTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SportsScreen)
