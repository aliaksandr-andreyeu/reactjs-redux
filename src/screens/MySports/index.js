import React, { Component } from 'react'
import { View, Text } from 'react-native'

import { axiosInstance, apiUrls } from '../../constants/api'

import { NavHeaderUser } from '../../components/NavHeaderUser'

import FilterWithSection from '../FilterScreens/FilterWithSections'
import axios from 'axios'

import Loading from '../../components/Loading'
import env from '../../config'
import Global from '../../components/global'
import styles from './styles'
import i18n from '../../../i18n'

import isEqual from 'lodash.isequal'

class MySports extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('more.my_sports')
    }
  }

  state = {
    sportCategoriesList: [],
    preferredSports: [],
    isLoading: true
  }

  mapList = (list, labelKey, idKey = 'Id') =>
    list.map(item => ({
      id: item[idKey],
      label: item[labelKey]
    }))

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props, prevProps)) {
      this.getData()
    }
  }

  getData() {
    let requests = [
      axiosInstance(apiUrls.getSportCategories + '?langCode=' + i18n.locale.toUpperCase()),
      axiosInstance(apiUrls.getPreferred + '?langCode=' + i18n.locale.toUpperCase())
    ]

    Promise.all(requests).then(([sportCategoriesList, preferredSports]) => {
      this.setState({
        sportCategoriesList: this.mapList(sportCategoriesList.data, 'NameInPrimaryLang'),
        preferredSports: preferredSports.data.map(item => item.Id),
        isLoading: false
      })
    })
  }

  setPreferredSports = itemKey => update => {
    const { navigation } = this.props

    console.log('SAVE', itemKey, update)

    let params = update && update.length > 0 ? update : []

    axiosInstance
      .post(apiUrls.getPreferred, params)
      .then(({ data }) => {
        console.log('setPreferredSports', data)

        navigation.popToTop()
        navigation.navigate('Home', {
          cache: Date.now()
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    const { sportCategoriesList, preferredSports, isLoading } = this.state
    const { navigation } = this.props

    if (isLoading) {
      return <Loading />
    }

    // console.log('sportCategoriesList', sportCategoriesList)
    // console.log('render() preferredSports', preferredSports)

    return (
      <FilterWithSection
        isMySports={true}
        navigation={navigation}
        params={{
          onApply: this.setPreferredSports('item'),
          selectedItems: preferredSports,
          items: sportCategoriesList
        }}
      />
    )
  }
}

export default MySports
