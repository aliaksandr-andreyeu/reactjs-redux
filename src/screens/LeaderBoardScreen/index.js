import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList } from 'react-native'
import { axiosInstance, apiUrls } from '../../constants/api'
import Tabs from '../../components/UI/Tabs'
import { leaderBoardTabs } from './constants'
import LeaderItem from './components/LeaderItem'
import Loading from '../../components/Loading'
import colors from '../../constants/colors'
import { NavHeaderUser } from '../../components/NavHeaderUser'
import i18n from '../../../i18n'

class LeaderBoardScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('more.leaderboard')
    }
  }

  state = {
    leaders: {
      week: [],
      month: [],
      year: []
    },
    isLoading: true,
    currentTabIndex: i18n.locale.toLowerCase() == 'en' ? 0 : leaderBoardTabs().length - 1
  }

  componentDidMount() {
    let params = {
      langCode: i18n.locale.toUpperCase()
    }

    axiosInstance.get(apiUrls.getLeaderboard, { params }).then(({ data }) => {
      this.setState({
        leaders: {
          week: data.Week,
          month: data.Month,
          year: data.Year
        },
        isLoading: false
      })
    })
  }

  onTabClick = currentTabIndex => {
    this.setState({
      currentTabIndex
    })
  }

  getLeadersList = () => {
    const { currentTabIndex, leaders } = this.state

    switch (currentTabIndex) {
      case 0:
        return i18n.locale.toLowerCase() == 'en' ? leaders.week : leaders.year
      case 1:
        return leaders.month
      case 2:
        return i18n.locale.toLowerCase() == 'en' ? leaders.year : leaders.week
      default:
        console.log('Invalid index has been provided.')
    }

    return []
  }

  render() {
    const { currentTabIndex, isLoading } = this.state

    if (isLoading) {
      return <Loading />
    }

    const leadersList = this.getLeadersList()

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Tabs
          tabs={i18n.locale.toLowerCase() == 'en' ? leaderBoardTabs() : leaderBoardTabs().reverse()}
          currentTab={currentTabIndex}
          onPress={this.onTabClick}
          isActivity
        />
        <View style={{ backgroundColor: colors.secondaryBackgroundLight, flex: 1 }}>
          <FlatList
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              marginHorizontal: 15,
              marginTop: 10,
              paddingTop: 15,
              paddingHorizontal: 15,
              backgroundColor: '#fff'
            }}
            data={leadersList}
            renderItem={({ item }) => <LeaderItem leader={item} />}
            keyExtractor={item => (item.Rank + currentTabIndex).toString()}
            extraData={this.state}
          />
        </View>
      </SafeAreaView>
    )
  }
}

export default LeaderBoardScreen
