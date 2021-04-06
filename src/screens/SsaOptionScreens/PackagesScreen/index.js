import React, { Component } from 'react'
import { ScrollView, FlatList, View, Text } from 'react-native'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import Package from './components/Package'
import ConfirmButtons from '../../../components/UI/ConfirmButtons'
import * as actions from '../../SsaMainScreen/actions'
import styles from './styles'
import i18n from '../../../../i18n'
import colors from '../../../constants/colors'

class PackagesScreen extends Component {
  constructor(props) {
    super(props)

    const { navigation, packageId, packagePrice } = props

    this.state = {
      selectedPackageId: packageId,
      selectedPackagePrice: packagePrice
    }

    this.packages = navigation.getParam('packages', [])
  }

  selectPackage = (selectedPackageId, selectedPackagePrice) => {
    this.setState({
      selectedPackageId: selectedPackageId.toString(),
      selectedPackagePrice
    })
  }

  getVenueName = () => {
    const { selectedPackageId } = this.state

    const foundPackage = this.packages.find(item => item.OfferId === +selectedPackageId)

    return (foundPackage && foundPackage.OfferTitle) || ''
  }

  render() {
    const { updateStore, packageId, packagePrice } = this.props
    const { selectedPackageId, selectedPackagePrice } = this.state

    // console.log( 'packageId: ', packageId )
    // console.log( 'packagePrice: ', packagePrice )

    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.titleBox}>
            <Text style={styles.title}>{i18n.t('socialSportsActivity.select_facility_rental')}</Text>
          </View>
          <FlatList
            ref={ref => {
              this.flatListRef = ref
            }}
            style={{
              marginHorizontal: 15
            }}
            data={this.packages}
            keyExtractor={(item, index) => item.OfferId.toString()}
            renderItem={({ item }) => <Package handleSelect={this.selectPackage} item={item} />}
          />
        </ScrollView>
        {Boolean(selectedPackageId) && (
          <View style={{ backgroundColor: colors.themeColor }}>
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDateText} ellipsizeMode="tail" numberOfLines={1}>
                {this.getVenueName()}
              </Text>
            </View>
            <ConfirmButtons
              confirmLabel={i18n.t('generic.buttons.apply')}
              cancelLabel={i18n.t('generic.buttons.clear')}
              buttonStyle={{ borderWidth: 1, borderColor: colors.borderLight }}
              handleSave={() =>
                updateStore({
                  packageId: selectedPackageId.toString(),
                  packagePrice: selectedPackagePrice,
                  date: '',
                  startTime: '',
                  endTime: ''
                })
              }
            />
          </View>
        )}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  packageId: state.socialSportActivity.packageId,
  packagePrice: state.socialSportActivity.packagePrice
})
const mapDispatchToProps = {
  updateStore: actions.setData
}

PackagesScreen.propTypes = {
  navigation: propTypes.shape({
    getParam: propTypes.func.isRequired
  }).isRequired,
  updateStore: propTypes.func.isRequired,
  packageId: propTypes.string.isRequired,
  packagePrice: propTypes.number.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(PackagesScreen)
