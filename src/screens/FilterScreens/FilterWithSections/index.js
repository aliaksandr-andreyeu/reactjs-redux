// model for SectionList
import React, { Component } from 'react';
import { View, Text, SectionList, ScrollView } from 'react-native';
import propTypes from 'prop-types';
import styles from './styles';
import FilterSearch from '../../../components/SortAndFilter/FilterSearch';
import FilterCheckbox from '../../../components/SortAndFilter/FilterCheckbox';
import ConfirmButtons from '../../../components/UI/ConfirmButtons';
import i18n from '../../../../i18n';

import isEqual from 'lodash.isequal';

class FilterWithSection extends Component {
  constructor(props) {
    super(props);

    const { navigation, isMySports, params } = this.props;

    // console.log('params ', params )

    let selectedItems = isMySports
      ? params.selectedItems
      : navigation.getParam('selectedItems', []);
    let processedSections = isMySports
      ? this.processList(params.items)
      : this.processList(navigation.getParam('items', []));

    // console.log('selectedItems ', selectedItems )
    // console.log('processedSections ', processedSections )

    this.state = {
      sectionsList: processedSections,
      filteredList: processedSections,
      selectedItems,
    };
  }

  componentDidUpdate(prevProps) {
    const { navigation, isMySports, params } = this.props;

    if (!isEqual(this.props, prevProps)) {
      let selectedItems = isMySports
        ? params.selectedItems
        : navigation.getParam('selectedItems', []);
      let processedSections = isMySports
        ? this.processList(params.items)
        : this.processList(navigation.getParam('items', []));

      this.state = {
        sectionsList: processedSections,
        filteredList: processedSections,
        selectedItems,
      };
    }
  }

  processList = data => {
    // console.log('processList data', data )
    const reducedData = this.reduceData(data);
    return Object.values(reducedData).sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }

      if (a.title > b.title) {
        return 1;
      }

      return 0;
    });
  };

  reduceData = data => {
    // console.log('reduceData data', data )
    return data.reduce((prev, next) => {
      const prevCopy = { ...prev };
      const title = next.label[0].toUpperCase();

      if (prevCopy[title]) {
        prevCopy[title].data.push(next);
      } else {
        prevCopy[title] = {
          title,
          data: [next],
        };
      }

      return prevCopy;
    }, {});
  };

  handleFilterSearch = query => {
    const { sectionsList, selectedItems } = this.state;

    if (!query.trim()) {
      return this.setState({
        filteredList: sectionsList,
      });
    }

    const processedQuery = query.trim().toLowerCase();

    const updatedList = sectionsList.map(section => {
      const sectionCopy = { ...section };

      sectionCopy.data = section.data.filter(
        item => selectedItems.includes(item.id) || item.label.toLowerCase().includes(processedQuery)
      );

      return sectionCopy;
    });

    return this.setState(() => ({
      filteredList: updatedList,
    }));
  };

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
    const { inputPlaceholder, navigation, isMySports, params } = this.props;
    const { filteredList, selectedItems } = this.state;

    let onApply = isMySports ? params.onApply : navigation.getParam('onApply', {});

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.innerWrapper}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
        >
          <View style={styles.filterContainer}>
            <FilterSearch
              placeholder={i18n.t('bookPlay.search')}
              onChange={this.handleFilterSearch}
            />
          </View>
          <SectionList
            style={styles.sectionContainer}
            sections={filteredList}
            keyExtractor={(item, index) => (item + index).toString()}
            renderItem={({ item }) => (
              <FilterCheckbox
                key={item.id}
                item={item}
                selectedItems={selectedItems}
                handleSelection={() => this.handleSelection(item.id)}
              />
            )}
            renderSectionHeader={({ section: { title, data } }) => {
              if (!data.length) {
                return null;
              }

              return (
                <Text
                  key={title}
                  style={{
                    ...styles.sectionHeader,
                    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                  }}
                >
                  {title}
                </Text>
              );
            }}
          />
        </ScrollView>
        <ConfirmButtons
          handleSave={() => onApply(selectedItems)}
          handleCancel={() => this.handleReset()}
          closeOnCancel={false}
          closeOnApply={isMySports ? false : true}
          confirmLabel={i18n.t('generic.buttons.apply')}
          cancelLabel={i18n.t('generic.buttons.reset')}
        />
      </View>
    );
  }
}

FilterWithSection.propTypes = {
  titleKey: propTypes.string,
  inputPlaceholder: propTypes.string,
  withSearch: propTypes.bool,
};

FilterWithSection.defaultProps = {
  withSearch: false,
  inputPlaceholder: i18n.t('generic.placeholders.search'),
};

export default FilterWithSection;
