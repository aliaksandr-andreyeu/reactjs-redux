import React, { Component } from 'react';

import { TouchableOpacity, Text, View } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import isEqual from 'lodash.isequal';

import i18n from '../../../../../../i18n';

import styles from './styles';

export default class ListItem extends Component {
  state = {
    expand: false,
  };

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    const { index, currentIndex } = this.props;
    const { expand } = this.state;
    if (!isEqual(this.props, prevProps)) {
      // if ( currentIndex !== undefined && index !== currentIndex ) {
      // this.setState({
      // expand: false,
      // })
      // }
    }
  }

  render() {
    const { item, index, onChange, currentIndex } = this.props;
    const { expand } = this.state;

    // console.log( 'item', item );
    console.log('index', index);
    console.log('currentIndex', currentIndex);

    return (
      <TouchableOpacity
        style={{
          ...(index && {
            borderTopWidth: 1,
            borderTopColor: '#8C9091',
          }),
        }}
        activeOpacity={0.9}
        onPress={() => {
          this.setState(
            {
              expand: !expand,
            },
            () => {
              onChange(index);
            }
          );
        }}
      >
        <View
          style={{
            ...styles.itemBox,
            flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
          }}
        >
          <Text
            style={{
              ...styles.textQuestion,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {item.Question}
          </Text>
          <Icon
            style={{}}
            name={expand ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#000066"
          />
        </View>
        {expand && (
          <View style={styles.textAnswerBox}>
            <Text
              style={{
                ...styles.textAnswer,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
              }}
            >
              {item.Answer}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}
