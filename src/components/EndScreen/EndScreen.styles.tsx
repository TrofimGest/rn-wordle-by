import {StyleSheet} from 'react-native';
import {colors} from '../../constants';

export default StyleSheet.create({
  title: {
    color: colors.lightgrey,
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 15,
  },
  subtitle: {
    color: colors.lightgrey,
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 15,
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  guessDistributionMarginContainer: {
    marginLeft: 5,
    marginRight: 10,
  },
  miscContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  nextWordleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  nextWordleText: {
    color: colors.lightgrey,
  },
  nextWordleTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.lightgrey,
  },
  shareButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontWeight: 'bold',
    color: colors.lightgrey,
  },
});
