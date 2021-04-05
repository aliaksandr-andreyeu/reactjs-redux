import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    paddingBottom: 10,
    minHeight: 140,
    marginBottom: 15,
    shadowColor: colors.shadowDark,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default styles;
