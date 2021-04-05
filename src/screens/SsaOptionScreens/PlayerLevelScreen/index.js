import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import RadioButton from '../../../components/UI/RadioButton';
import { playerLevels } from './constants';
import styles from './styles';
import SsaScreenTitle from '../components/SsaScreenTitle';
import * as actions from '../../SsaMainScreen/actions';
import ConfirmButtons from '../../../components/UI/ConfirmButtons';
import i18n from '../../../../i18n';

class PlayerLevelScreen extends Component {
  state = {
    selectedItem: this.props.playerLevel,
  };

  handleSelect = index => {
    const { selectedItem } = this.state;

    if (index !== selectedItem) {
      this.setState({
        selectedItem: index,
      });
    }
  };

  render() {
    const { selectedItem } = this.state;
    const { updateStore } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.innerWrapper}>
          <SsaScreenTitle text={i18n.t('socialSportsActivity.player_level')} />
          <View>
            {playerLevels().map((level, index) => (
              <RadioButton
                key={index}
                handleSelect={() => this.handleSelect(index)}
                label={level}
                isSelected={selectedItem === index}
              />
            ))}
          </View>
        </View>
        <ConfirmButtons
          handleSave={() => updateStore({ playerLevel: selectedItem })}
          confirmLabel={i18n.t('generic.buttons.apply')}
          cancelLabel={i18n.t('generic.buttons.clear')}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  playerLevel: state.socialSportActivity.playerLevel,
});
const mapDispatchToProps = {
  updateStore: actions.setData,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerLevelScreen);
