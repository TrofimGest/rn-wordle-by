import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../../constants';

type Props = {
  number: number;
  label: string;
};

const Number = ({number, label}: Props) => (
  <View style={styles.numberContainer}>
    <Text style={styles.number}>{number}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
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
});

export default Number;
