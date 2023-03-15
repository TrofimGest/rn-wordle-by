import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../../constants';

type Props = {
  position: number;
  amount: number;
  percentage: number;
};

const GuessDistributionLine = ({position, amount, percentage}: Props) => {
  return (
    <View style={styles.positionContainer}>
      <Text style={styles.position}>{position}</Text>
      <View style={[styles.amountContainer, {width: `${percentage}%`}]}>
        <Text style={styles.amount}>{amount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  position: {
    color: colors.lightgrey,
  },
  amountContainer: {
    width: '100%',
    alignItems: 'flex-end',
    backgroundColor: colors.grey,
    margin: 5,
    padding: 5,
  },
  amount: {
    color: colors.lightgrey,
  },
});

export default GuessDistributionLine;
