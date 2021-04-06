import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import ConfirmButtons from '../../../components/UI/ConfirmButtons'
import styles from './styles'
import * as actions from '../../PackageDetailsScreen/actions'
import i18n from '../../../../i18n'

class SubFacilitiesScreen extends Component {
  constructor(props) {
    super(props)

    const { subFacilityId } = props

    this.state = {
      subFacilityId
    }
  }

  selectSubfacility = subFacilityId => {
    this.setState({
      subFacilityId
    })
  }

  applyChanges = () => {
    const { selectSubFacility } = this.props
    const { subFacilityId } = this.state

    selectSubFacility({ subFacilityId })
  }

  render() {
    const { navigation } = this.props
    const { subFacilityId } = this.state

    const subFacilities = navigation.getParam('data', {})

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.innerWrapper}>
            <Text style={styles.screenTitle}>{i18n.t('package.subfacility')}</Text>
            <FlatList
              data={subFacilities}
              extraData={this.state}
              renderItem={({ item }) => {
                const selected = subFacilityId === item.Id
                return (
                  <TouchableOpacity
                    style={[styles.item, selected && styles.selected]}
                    onPress={() => this.selectSubfacility(item.Id)}
                  >
                    <Text style={[styles.itemText, selected && styles.itemTextSelected]}>{item.Title}</Text>
                  </TouchableOpacity>
                )
              }}
              keyExtractor={item => item.Id.toString()}
            />
          </View>
        </View>
        <View>
          <ConfirmButtons
            confirmLabel={i18n.t('generic.buttons.apply')}
            cancelLabel={i18n.t('generic.buttons.clear')}
            handleSave={this.applyChanges}
            closeOnApply
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  subFacilityId: state.packageDetails.subFacilityId
})
const mapDispatchToProps = {
  selectSubFacility: actions.setData
}

export default connect(mapStateToProps, mapDispatchToProps)(SubFacilitiesScreen)
