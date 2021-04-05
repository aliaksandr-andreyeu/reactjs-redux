import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import RadioButton from '../../../../components/UI/RadioButton';
import styles from './styles';
import { activityTypes } from './constants';
import * as actions from '../../actions';

class Terms extends Component {
  state = {
    selectedItem: 0,
  };

  selectItem = selectedItem => {
    const { updateStore } = this.props;

    this.setState(
      {
        selectedItem,
      },
      () => updateStore({ payment: selectedItem })
    );
  };

  render() {
    const { selectedItem } = this.state;
    const { isDisabled } = this.props;

    return (
      <View style={styles.container}>
        {activityTypes().map((typeName, index) => (
          <View style={{ flex: 1 }} key={typeName}>
            <RadioButton
              style={styles.button}
              isSelected={selectedItem === index}
              label={typeName}
              handleSelect={() => (isDisabled ? null : this.selectItem(index))}
            />
          </View>
        ))}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  payment: state.socialSportActivity.payment,
});
const mapDispatchToProps = {
  updateStore: actions.setData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Terms);
