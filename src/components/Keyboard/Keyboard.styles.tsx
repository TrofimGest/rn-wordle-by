import {StyleSheet, Dimensions} from 'react-native';
import {keys, colors} from '../../constants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const screenWidth = windowHeight > windowWidth ? windowWidth : windowHeight;
export const keyWidth = (screenWidth - 10) / keys[0].length;
const keyHeight = keyWidth * 1.8;

export default StyleSheet.create({
  keyboard: {
    alignSelf: 'stretch',
    marginTop: 'auto',
    marginBottom: 20,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  key: {
    width: keyWidth - 4,
    height: keyHeight - 4,
    margin: 2,
    borderRadius: 5,
    backgroundColor: colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    color: colors.lightgrey,
    fontWeight: 'bold',
  },
});
