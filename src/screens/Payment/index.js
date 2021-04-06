/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, ScrollView, FlatList, TouchableOpacity, View } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import axios from 'axios';
import AddCard from '../../components/CheckoutForm';
import { axiosInstance, apiUrls, checkoutApi } from '../../constants/api';
import PaymentMethodItem from './components/PaymentMethodItem';
import Loading from '../../components/Loading';
import styles from './styles';
import { checkoutApiKeyPublic } from '../../../secret/checkoutApiKey';
import i18n from '../../../i18n';
import { NavHeaderUser } from '../../components/NavHeaderUser';
import colors from '../../constants/colors';

const resetAction = params =>
  StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'PaymentResultsScreen', params: { data: params } }),
    ],
  });

class Payment extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      // title: i18n.t('payment.your_cart'),
      title: i18n.t('payment.checkout'),
    };
  };

  state = {
    paymentMethods: [],
    showAddForm: false,
    isLoading: true,
    amountToPay: 0,
    itemsInCart: [],
    selectedMethodId: -1,
    cardAddedFlag: 0,
    accountBalance: 0,
  };

  componentDidMount() {
    const requests = [
      axiosInstance(apiUrls.getUserPaymentMethods),
      axiosInstance(apiUrls.getFullCart),
      axiosInstance(apiUrls.getAccountBalance),
    ];

    Promise.all(requests).then(([paymentMethodsRes, cartRes, accountBalance]) => {
      const amountToPay = cartRes.data.reduce((acc, ticket) => acc + ticket.Price, 0);

      const paymentMethods = this.mapPaymentMethods(paymentMethodsRes.data);

      console.log('amountToPay', amountToPay);
      console.log('accountBalance', accountBalance.data.current);

      this.setState({
        paymentMethods,
        isLoading: false,
        amountToPay,
        itemsInCart: cartRes.data,
        accountBalance: accountBalance.data.current,
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { cardAddedFlag } = this.state;

    if (prevState.cardAddedFlag !== cardAddedFlag) {
      axiosInstance(apiUrls.getUserPaymentMethods).then(({ data }) => {
        const paymentMethods = this.mapPaymentMethods(data);

        this.setState({
          paymentMethods,
          showAddForm: false,
        });
      });
    }
  }

  mapPaymentMethods = paymentMethods =>
    paymentMethods.map(({ Last4, Scheme, Id, ...more }) => ({
      last4: Last4,
      brand: Scheme,
      id: Id,
      more,
    }));

  openAddForm = () => {
    this.setState({
      showAddForm: true,
    });
  };

  selectPaymentMethod = id => {
    this.setState({
      selectedMethodId: id,
    });
  };

  payByExistingCard = (id, balance) => {
    const paymentParams = {
      Token: id,
      Type: balance ? 'dxb_wallet_balance' : 'id',
    };

    this.proceedToPayment(paymentParams);
  };

  addPaymentMethod = (cardNumber, cardExpiry, cardCvc) => {
    const [expiryMonth, expiryYear] = cardExpiry.split('/');

    const params = {
      type: 'card',
      number: cardNumber,
      expiry_month: expiryMonth,
      expiry_year: `20${expiryYear}`,
      cvv: cardCvc,
    };

    const headers = {
      Authorization: checkoutApiKeyPublic,
    };

    axios({
      url: checkoutApi.addCard,
      method: 'POST',
      data: params,
      headers,
    })
      .then(({ data }) => {
        const paymentParams = {
          Token: data.token,
          Type: 'token',
        };

        this.proceedToPayment(paymentParams);
      })
      .catch(err => {
        console.log(err);
      });

    return Promise.resolve(cardNumber);
  };

  proceedToPayment = paymentParams => {
    const { navigation } = this.props;
    const { amountToPay, itemsInCart } = this.state;

    axiosInstance
      .post(apiUrls.postPaymnetPay, paymentParams)
      .then(() => {
        const ssaIdsToPublish = itemsInCart.map(item => item.SsaEventId).filter(v => Boolean(v));

        ssaIdsToPublish.forEach(id =>
          axiosInstance.post(apiUrls.publishSsa, { id, isActive: true })
        );

        navigation.dispatch(resetAction({ amountToPay, isSuccess: true }));
      })
      .catch(err => {
        navigation.navigate('PaymentResultsScreen', { data: { amountToPay, isSuccess: false } });
      });
  };

  render() {
    const {
      accountBalance,
      paymentMethods,
      isLoading,
      showAddForm,
      amountToPay,
      itemsInCart,
    } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    // console.log('accountBalance', accountBalance)
    // console.log('amountToPay', amountToPay)
    // console.log('amountToPay accountBalance', amountToPay <= accountBalance )

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.contentWrapper}>
          <Text
            style={{
              ...styles.text,
              ...styles.title,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('payment.your_cart')}
          </Text>
          <Text
            style={{
              ...styles.text,
              ...styles.mainContent,
              marginBottom: 30,
              lineHeight: 26,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n
              .t('payment.info')
              .replace('**', itemsInCart.length)
              .replace('*', amountToPay.toFixed(2))}
          </Text>
          <Text
            style={{
              ...styles.text,
              marginBottom: 15,
              lineHeight: 23,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('payment.balance_info').replace('*', accountBalance)}
          </Text>
          <Text
            style={{
              ...styles.text,
              ...styles.lightText,
              marginBottom: 40,
              lineHeight: 23,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
            }}
          >
            {i18n.t('payment.selectedMethodMessage')}
          </Text>

          {amountToPay <= accountBalance && (
            <PaymentMethodItem
              isBalance={true}
              onPress={this.payByExistingCard}
              item={{
                id: 'dxb_wallet_balance',
              }}
            />
          )}

          <FlatList
            data={paymentMethods}
            extraData={paymentMethods}
            renderItem={({ item }) => {
              // console.log(item, item)
              return <PaymentMethodItem onPress={this.payByExistingCard} item={item} />;
            }}
            keyExtractor={(item, index) => (item.last4 + item.brand + index).toString()}
          />

          {!showAddForm ? (
            <TouchableOpacity onPress={this.openAddForm}>
              <Text
                style={{
                  ...styles.addButton,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                }}
              >
                {i18n.t('payment.addPaymentMessage')}
              </Text>
            </TouchableOpacity>
          ) : (
            <AddCard
              addCardHandler={this.addPaymentMethod}
              scanCardVisible={false}
              addCardButtonText={i18n.t('payment.addCard')}
              // activityIndicatorColor="pink"
              // activityIndicatorColor={colors.themeColor}
              // placeholderTextColor="black"
              // placeholderTextColor={colors.basicText}
              placeholderTextColor={colors.searchColor}
              cardNumberPlaceholderText="4242 4242 4242 4242"
              expiryPlaceholderText={i18n.t('payment.mm_yy')}
              cvcPlaceholderText={i18n.t('payment.cvc')}
              cardNumberErrorMessage={i18n.t('payment.incorrectNumber')}
              expiryErrorMessage={i18n.t('payment.incorrectExpiry')}
              cvcErrorMessage={i18n.t('payment.incorrectCvc')}
            />
          )}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  activityType: state.socialSportActivity.activityType,
});

export default connect(mapStateToProps)(Payment);
