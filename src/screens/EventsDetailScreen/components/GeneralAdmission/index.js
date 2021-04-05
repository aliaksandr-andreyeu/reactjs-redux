import React, { Component } from 'react';
import { Alert, View, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import styles from './styles';
import GaOption from '../GaOption';
import ActionButton from '../../../../components/Details/ActionButton';
import i18n from '../../../../../i18n';
import { axiosInstance, apiUrls } from '../../../../constants/api';
import Global from '../../../../components/global';

class GeneralAdmission extends Component {
  constructor(props) {
    super(props);

    const { categories } = props;

    this.state = {
      isCounter: 0,
      counter: categories.reduce((acc, next) => {
        acc[next.Id] = '0';
        return acc;
      }, {}),
    };
  }

  setCounter = chunk => {
    this.setState(
      ({ counter }) => ({
        counter: {
          ...counter,
          ...chunk,
        },
      }),
      () => {
        const { counter } = this.state;

        let data = 0;

        for (key in counter) {
          data += +counter[key];
        }

        this.setState({
          isCounter: data,
        });
      }
    );
  };

  handleGaPurchase = () => {
    if (Boolean(Global.user && Global.user.token && Global.user.token.length > 5)) {
      const { counter } = this.state;
      const { categories, navigation } = this.props;

      const pricingCategories = Object.entries(counter)
        .filter(item => {
          return +item[1] > 0;
        })
        .map(item => {
          return {
            Id: item[0],
            Count: item[1],
          };
        });

      const params = {
        EventId: categories[0].EventId,
        PricingCategories: pricingCategories,
      };

      // console.log('params', params);

      axiosInstance
        .post(apiUrls.postBookGeneralAdmission, params)
        .then(res => {
          navigation.navigate('Cart');
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      Alert.alert(
        i18n.t('alerts.unauth_proceed_checkout'),
        false,
        [
          {
            text: i18n.t('alerts.login'),
            onPress: () => this.props.navigation.navigate('SignIn', {}),
          },
          {
            text: i18n.t('alerts.cancel'),
            style: 'cancel',
          },
        ],
        {
          cancelable: false,
        }
      );
    }
  };

  render() {
    const { categories, premierOnline, platinumList } = this.props;
    const { counter, isCounter } = this.state;

    let isDisable = Boolean(premierOnline) || Boolean(platinumList);

    return (
      <View style={styles.paddedWrapper}>
        <View style={styles.catsWrapper}>
          <View style={{ marginBottom: 15 }}>
            <Text
              style={{
                ...styles.text,
                ...styles.boldText,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
              }}
            >
              {i18n.t('events.available_tickets')}
            </Text>
          </View>
          {categories.map((category, i) => {
            return (
              <GaOption
                key={i}
                category={category}
                counter={counter[category.Id]}
                setCounter={this.setCounter}
                disable={isDisable && !Boolean(+counter[category.Id]) && Boolean(isCounter)}
              />
            );
          })}
        </View>
        <ActionButton
          onPress={this.handleGaPurchase}
          label={i18n.t('events.proceed_to_checkout')}
        />
      </View>
    );
  }
}

export default withNavigation(GeneralAdmission);
