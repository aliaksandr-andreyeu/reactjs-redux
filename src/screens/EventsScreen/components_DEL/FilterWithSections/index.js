// model for SectionList
import React, { Component } from 'react';
import { View, Text, SectionList, TouchableOpacity } from 'react-native';
import propTypes from 'prop-types';
import categories from './data';
import styles from './styles';
import FilterSearch from '../FilterSearch';
import Icon from '../../../../components/Icon';
import colors from '../../../../constants/colors';

class FilterWithSection extends Component {
  state = {
    sectionsList: [],
    filteredList: [],
    selectedItems: [],
  };

  componentDidMount() {
    const processedSections = this.processList(categories);
    this.setState({
      sectionsList: processedSections,
      filteredList: processedSections,
    });
  }

  processSelection = id => {
    const { selectedItems } = this.state;

    let updatedList = [...selectedItems];

    if (updatedList.includes(id)) {
      updatedList = updatedList.filter(itemId => itemId !== id);
    } else {
      updatedList.push(id);
    }

    this.setState({
      selectedItems: updatedList,
    });
  };

  processList = data => {
    const { titleKey } = this.props;
    const reducedData = this.reduceData(data, titleKey);

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
    const { titleKey } = this.props;

    return data.reduce((prev, next) => {
      const prevCopy = { ...prev };
      const title = next[titleKey][0].toUpperCase();

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
    const { titleKey } = this.props;

    if (!query.trim()) {
      return this.setState({
        filteredList: sectionsList,
      });
    }

    const processedQuery = query.trim().toLowerCase();

    const updatedList = [...sectionsList].map(section => {
      const sectionCopy = { ...section };

      sectionCopy.data = section.data.filter(
        item =>
          selectedItems.includes(item.Id) || item[titleKey].toLowerCase().includes(processedQuery)
      );

      return sectionCopy;
    });

    return this.setState(() => ({
      filteredList: updatedList,
    }));
  };

  renderSectionHeader = header => {
    return <Text style={styles.sectionHeader}>{header}</Text>;
  };

  renderListItem = item => {
    const { titleKey } = this.props;
    const { selectedItems } = this.state;

    const isSelected = selectedItems.includes(item.Id);

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => this.processSelection(item.Id)}>
        <Text style={styles.itemName}>{item[titleKey]}</Text>

        <View style={[styles.checkBox, isSelected && styles.selected]}>
          {isSelected &&
            Icon.getIcon(Icon.iconLibraries.fontAwesome, 'check', {
              size: 18,
              color: colors.basicLightText,
            })}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { withSearch, inputPlaceholder } = this.props;
    const { filteredList } = this.state;

    return (
      <View style={styles.container}>
        {withSearch && (
          <View style={styles.filterContainer}>
            <FilterSearch placeholder={inputPlaceholder} onChange={this.handleFilterSearch} />
          </View>
        )}
        <View style={styles.sectionContainer}>
          <SectionList
            sections={filteredList}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => this.renderListItem(item)}
            renderSectionHeader={({ section: { title, data } }) => {
              if (!data.length) {
                return null;
              }

              return this.renderSectionHeader(title);
            }}
          />
        </View>
      </View>
    );
  }
}

FilterWithSection.propTypes = {
  titleKey: propTypes.string.isRequired,
  inputPlaceholder: propTypes.string,
  withSearch: propTypes.bool,
};

FilterWithSection.defaultProps = {
  withSearch: false,
  inputPlaceholder: 'Search',
};

export default FilterWithSection;
