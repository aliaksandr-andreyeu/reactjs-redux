import React, { Component } from 'react'
import i18n from '../../../i18n'
import { Platform } from 'react-native'

import IconLanguage from '../../assets/images/icons/icon_language.svg'

export default {
  welcomeMessage: () => i18n.t('more.hi_guest'),
  signInButtonText: () => i18n.t('generic.sign_in'),
  registerButtonText: () => i18n.t('signup.register_now'),
  logoutButtonText: () => i18n.t('generic.logout'),
  sections: [
    {
      title: () => i18n.t('more.account_and_settings'),
      data: [
        {
          text: () => i18n.t('more.account_details'),
          authorizedOnly: true,
          targetScreen: 'EditProfile',
          navigationParams: null
        },
        {
          text: () => i18n.t('more.my_sports'),
          authorizedOnly: true,
          targetScreen: 'MySports',
          navigationParams: {}
        },
        {
          text: () => i18n.t('more.my_bookings'),
          authorizedOnly: true,
          targetScreen: 'MyBookings',
          navigationParams: {
            currentTab: 0
          }
        },
        {
          text: () => i18n.t('more.my_bookmarks'),
          authorizedOnly: true,
          targetScreen: 'HeaderSearch',
          navigationParams: {
            searchForm: {
              isBookmarked: true
            }
          }
        },
        {
          text: () => {
            return i18n.locale.toLowerCase() == 'en' ? (
              <>
                {i18n.t('more.language')}
                {'  '}|{'  '}
                {i18n.t('more.language_ar')}
              </>
            ) : (
              <>
                {i18n.t('more.language')}
                {'  '}|{'  '}
                {i18n.t('more.language_en')}
              </>
            )
          },
          icon: () => <IconLanguage width={30} height={30} />,
          authorizedOnly: false,
          // targetScreen: 'Welcome',
          targetScreen: null,
          navigationParams: null,
          modalLanguage: true
        }
      ]
    },
    /*{
    title: () => i18n.t('more.events'),
    data: [{
      text: () => i18n.t('more.all_events'),
      authorizedOnly: false,
      targetScreen: 'Events',
      navigationParams: null,
    }, {
      text: () => i18n.t('more.free_spectating_events'),
      authorizedOnly: false,
      targetScreen: '',
      navigationParams: null,
    }, {
      text: () => i18n.t('more.ticketed_spectating_events'),
      authorizedOnly: false,
      targetScreen: '',
      navigationParams: null,
    }, {
      text: () => i18n.t('more.social_sports_events'),
      authorizedOnly: false,
      targetScreen: '',
      navigationParams: null,
    }],
  }, */ {
      title: () => i18n.t('more.special'),
      data: [
        /*
    Platform.OS === 'ios' || Platform.OS === 'android' ? false : {
      text: () => i18n.t('more.ar_mode'),
      authorizedOnly: false,
      targetScreen: 'ARMode',
      navigationParams: null,
    }, {
      text: () => i18n.t('more.explore_dubai'),
      authorizedOnly: false,
      targetScreen: '',
      navigationParams: null,
    }, */ {
          text: () => i18n.t('more.health_report'),
          authorizedOnly: false,
          targetScreen: 'HealthReport',
          navigationParams: null
        } /* {
      text: () => i18n.t('more.leaderboard'),
      authorizedOnly: false,
      targetScreen: 'LeaderBoard',
      navigationParams: null,
    } */
      ]
    },
    /* {
    title: () => i18n.t('more.news_and_features'),
    data: [{
      text: () => i18n.t('more.news_and_features'),
      authorizedOnly: false,
      targetScreen: 'News',
      navigationParams: null,
    }],
  }, */ {
      title: () => i18n.t('more.community'),
      data: [
        {
          text: () => i18n.t('activities.my_matches'),
          authorizedOnly: true,
          targetScreen: 'MyActivitiesScreen',
          navigationParams: {
            currentTab: 0
          }
        },
        {
          text: () => i18n.t('activities.my_invitations'),
          authorizedOnly: true,
          targetScreen: 'MyActivitiesScreen',
          navigationParams: {
            currentTab: 1
          }
        },
        {
          text: () => i18n.t('more.join_match'),
          authorizedOnly: true,
          targetScreen: 'Bookings',
          navigationParams: null
        },
        {
          text: () => i18n.t('more.host_activity'),
          authorizedOnly: true,
          targetScreen: 'CreateSsaMain',
          navigationParams: null
        },
        {
          text: () => i18n.t('more.leaderboard'),
          authorizedOnly: false,
          targetScreen: 'LeaderBoard',
          navigationParams: null
        }
      ]
    },
    /* {
    title: () => i18n.t('more.booking'),
    data: [{
      text: () => i18n.t('more.flights'),
      authorizedOnly: false,
      targetScreen: '',
      navigationParams: null,
    }, {
      text: () => i18n.t('more.hotels'),
      authorizedOnly: false,
      targetScreen: '',
      navigationParams: null,
    }, {
      text: () => i18n.t('more.transportation'),
      authorizedOnly: false,
      targetScreen: '',
      navigationParams: null,
    }, {
      text: () => i18n.t('more.combo_packages'),
      authorizedOnly: false,
      targetScreen: '',
      navigationParams: null,
    }],
  }, */ {
      title: () => i18n.t('more.about'),
      data: [
        {
          text: () => i18n.t('more.app_info'),
          authorizedOnly: false,
          targetScreen: 'AppInfo',
          navigationParams: null
        },
        /* {
      text: () => i18n.t('more.contact_us'),
      authorizedOnly: false,
      targetScreen: '',
      navigationParams: null,
    }, */ {
          text: () => i18n.t('more.terms_of_use'),
          authorizedOnly: false,
          targetScreen: 'Policy',
          navigationParams: {
            constraint: 'terms-of-use'
          }
        },
        {
          text: () => i18n.t('more.privacy_policy'),
          authorizedOnly: false,
          targetScreen: 'Policy',
          navigationParams: {
            constraint: 'privacy-policy'
          }
        },
        {
          text: () => i18n.t('more.refund_policy'),
          authorizedOnly: false,
          targetScreen: 'Policy',
          navigationParams: {
            constraint: 'refund-policy'
          }
        },
        {
          text: () => i18n.t('more.contact_us'),
          authorizedOnly: false,
          targetScreen: 'ContactUs',
          navigationParams: null
        }
      ]
    }
  ].filter(Boolean)
}
