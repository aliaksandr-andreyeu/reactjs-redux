import React from 'react'
import { View, Text, Image } from 'react-native'
import styles from './styles'
import i18n from '../../../../../i18n'
import Avatar from '../../../../components/avatar'

import colors from '../../../../constants/colors'

const AccountDetails = ({ fullName, accountBalance, image }) => (
  <View
    style={{
      ...styles.container,
      flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse'
    }}
  >
    <Avatar size={60} />

    <View
      style={{
        ...styles.detailsContainer,
        marginLeft: i18n.locale.toLowerCase() == 'en' ? 16 : 0,
        marginRight: i18n.locale.toLowerCase() == 'en' ? 0 : 16
      }}
    >
      <Text
        style={{
          ...styles.text,
          ...styles.name,
          textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
        }}
      >
        {fullName}
      </Text>
      <View
        style={{
          ...styles.balanceRow,
          flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse'
        }}
      >
        <Text
          style={{
            ...styles.text,
            textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
          }}
        >
          {i18n.t('more.current_balance')}
        </Text>
        {accountBalance !== null && (
          <Text
            style={{
              ...styles.text,
              ...styles.accountBalance,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'right' : 'left'
            }}
          >
            {`${i18n.t('generic.aed')} ${accountBalance}`}
            {/*  */}
          </Text>
        )}
      </View>
    </View>
  </View>
)

export default AccountDetails
