import React, { Component } from 'react';
import { FlatList } from 'react-native';
import Checkbox from '../../../components/SortAndFilter/FilterCheckbox';
import FilterLayout from '../../../components/SortAndFilter/SortAndFilterLayout';

class CheckboxFilter extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;

    const selectedItems = navigation.getParam('selectedItems', []);

    this.state = {
      selectedItems,
    };
  }

  handleSelection = id => {
    const { selectedItems } = this.state;
    let updatedList = [...selectedItems];

    if (selectedItems.includes(id)) {
      updatedList = updatedList.filter(itemId => itemId !== id);
    } else {
      updatedList.push(id);
    }

    this.setState({
      selectedItems: updatedList,
    });
  };

  handleReset = () => {
    this.setState({
      selectedItems: [],
    });
  };

  render() {
    const { navigation } = this.props;
    const { selectedItems } = this.state;

    const { onApply, screenTitle } = navigation.state.params || {};
    const items = navigation.getParam('items', []);

    return (
      <FilterLayout
        title={screenTitle}
        onApply={() => onApply(selectedItems)}
        onCancel={() => this.handleReset()}
      >
        <FlatList
          data={items}
          extraData={this.state}
          renderItem={({ item }) => (
            <Checkbox
              item={item}
              selectedItems={selectedItems}
              handleSelection={() => this.handleSelection(item.id)}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      </FilterLayout>
    );
  }
}

export default CheckboxFilter;
