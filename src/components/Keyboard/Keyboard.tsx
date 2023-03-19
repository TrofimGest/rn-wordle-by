import React from 'react';
import {View, Text, Pressable} from 'react-native';
import Animated, {SlideInDown} from 'react-native-reanimated';
import {keys, ENTER, CLEAR, colors} from '../../constants';
import styles, {keyWidth} from './Keyboard.styles';

type KeyboardProps = {
  onKeyPressed: (key: string) => void;
  yellowCaps: string[];
  greyCaps: string[];
  greenCaps: string[];
};

const Keyboard = ({
  onKeyPressed = () => {},
  greenCaps = [],
  yellowCaps = [],
  greyCaps = [],
}: KeyboardProps) => {
  const isLongButton = (key: string): boolean => {
    return key === ENTER || key === CLEAR;
  };

  const getKeyBGColor = (key: string): string => {
    if (greyCaps.includes(key)) {
      return colors.darkgrey;
    }
    if (greenCaps.includes(key)) {
      return colors.primary;
    }
    if (yellowCaps.includes(key)) {
      return colors.secondary;
    }

    return colors.grey;
  };

  return (
    <Animated.View
      entering={SlideInDown.springify().mass(0.5)}
      style={styles.keyboard}>
      {keys.map((keyRow, i) => (
        <View style={styles.row} key={`row-${i}`}>
          {keyRow.map(key => (
            <Pressable
              onPress={() => onKeyPressed(key)}
              key={key}
              style={[
                styles.key,
                isLongButton(key) ? {width: keyWidth * 1.4} : {},
                {backgroundColor: getKeyBGColor(key)},
              ]}>
              <Text style={styles.keyText}>{key.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </Animated.View>
  );
};

export default Keyboard;
