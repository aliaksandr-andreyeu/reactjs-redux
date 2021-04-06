import i18n from '../../../i18n'

export const sectionTypes = {
  venues: 'venues',
  events: 'events',
  ssa: 'ssa',
  packages: 'packages'
}

export const sectionTitles = {
  events: () => i18n.t('venues.events'),
  ssa: () => i18n.t('venues.social_sports_events'),
  packages: () => i18n.t('venues.packages')
}

export const sections = {
  venues: {
    type: sectionTypes.venues
  },
  events: {
    type: sectionTypes.events,
    title: sectionTitles.events
  },
  ssa: {
    type: sectionTypes.ssa,
    title: sectionTitles.ssa
  },
  packages: {
    type: sectionTypes.packages,
    title: sectionTitles.packages
  }
}
