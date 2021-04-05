import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import SsaScreenTitle from '../components/SsaScreenTitle';
import ConfirmButtons from '../../../components/UI/ConfirmButtons';
import styles from './styles';
import * as actions from '../../SsaMainScreen/actions';
import i18n from '../../../../i18n';
import colors from '../../../constants/colors';

class SubFacilitiesScreen extends Component {
  constructor(props) {
    super(props);

    const { subFacilityId } = props;

    this.state = {
      subFacilityId,
    };
  }

  selectSubfacility = subFacilityId => {
    this.setState({
      subFacilityId,
    });
  };

  applyChanges = () => {
    const { selectSubFacility } = this.props;
    const { subFacilityId } = this.state;

    selectSubFacility({ subFacilityId });
  };

  render() {
    const { navigation } = this.props;
    const { subFacilityId } = this.state;

    const subFacilities = navigation.getParam('data', {});

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.innerWrapper}>
            <SsaScreenTitle
              text={i18n.t('socialSportsActivity.subfacility')}
              styles={styles.title}
            />
            <FlatList
              data={subFacilities}
              extraData={this.state}
              renderItem={({ item }) => {
                const selected = subFacilityId === item.Id;
                // console.log('item', item)
                return (
                  <TouchableOpacity
                    style={[styles.item, selected && styles.selected]}
                    onPress={() => this.selectSubfacility(item.Id)}
                  >
                    <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
                      {item.Title}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item.Id}
            />
          </View>
        </View>
        <View>
          <ConfirmButtons
            confirmLabel={i18n.t('generic.buttons.apply')}
            cancelLabel={i18n.t('generic.buttons.clear')}
            handleSave={this.applyChanges}
            closeOnApply
            containerStyle={{ backgroundColor: colors.themeColor }}
            buttonStyle={{ borderWidth: 1, borderColor: colors.borderLight }}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  subFacilityId: state.socialSportActivity.subFacilityId,
});
const mapDispatchToProps = {
  selectSubFacility: actions.setData,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubFacilitiesScreen);
