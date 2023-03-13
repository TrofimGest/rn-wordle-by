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
  numberContainer: {
    alignItems: 'center',
    maxWidth: '25%',
    marginHorizontal: 10,
  },
  number: {
    color: colors.lightgrey,
    fontSize: 30,
    fontWeight: 'bold',
  },
  label: {
    color: colors.lightgrey,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  guessDistributionContainer: {
    width: '100%',
    padding: 20,
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  position: {
    color: colors.lightgrey,
  },
  amountContainer: {
    width: '80%',
    alignSelf: 'stretch',
    backgroundColor: colors.grey,
    margin: 5,
    padding: 5,
  },
  amount: {
    color: colors.lightgrey,
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
  shareButtonText: {fontWeight: 'bold', color: colors.lightgrey},
});
