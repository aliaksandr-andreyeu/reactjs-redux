/* eslint-disable import/prefer-default-export */
import { sectionTypes } from './constants';
import { sportActivityTypes } from '../../constants/socialSportsActivity';
import i18n from '../../../i18n';

export const getListItemParams = (item, type) => {
  switch (type) {
    case sectionTypes.venues:
      return {
        title: item.Title,
        imageUri: item.ImageURL,
        screen: 'VenueDetails',
      };
    case sectionTypes.events:
      return {
        title: item.Title,
        imageUri: item.ImageURL,
        tagLabel: i18n.t('venues.tickets'),
        withDate: true,
        screen: 'EventDetail',
      };
    case sectionTypes.ssa:
      return {
        title: item.Title,
        imageUri: item.ImageURL,
        tagLabel: i18n.t('venues.join'),
        withDate: false,
        screen: 'SsaEventDetailsScreen',
      };
    case sectionTypes.packages:
      return {
        title: item.Title,
        imageUri: item.ImageURL,
        withDate: false,
        tagLabel: i18n.t('venues.buy'),
        screen: 'PackageDetails',
      };
    default:
      return {};
  }
};

export const sortEventsByType = items => {
  const events = [];
  const ssa = [];
  const packages = [];

  items.forEach(item => {
    switch (item.SportActivityType) {
      case sportActivityTypes.FreeEvents:
      case sportActivityTypes.TicketedEvents: {
        events.push(item);
        break;
      }
      case sportActivityTypes.SocialSportsActivities: {
        ssa.push(item);
        break;
      }
      case sportActivityTypes.SingleEntry:
      case sportActivityTypes.Membership:
      case sportActivityTypes.FullFacilityRental: {
        packages.push(item);
        break;
      }
      default: {
        console.log('Another type');
      }
    }
  });

  return {
    events,
    ssa,
    packages,
  };
};

export const filterPackages = items => {
  const { SingleEntry, Membership, FullFacilityRental } = sportActivityTypes;

  return items.filter(
    ({ SportActivityType }) =>
      SportActivityType === SingleEntry ||
      SportActivityType === Membership ||
      SportActivityType === FullFacilityRental
  );
};
