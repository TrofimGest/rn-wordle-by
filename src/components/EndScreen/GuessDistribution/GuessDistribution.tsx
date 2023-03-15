import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GuessDistributionLine from '../GuessDistributionLine/GuessDistributionLine';
import {colors} from '../../../constants';

type Props = {
  distribution: number[];
};

const GuessDistribution = ({distribution}: Props) => {
  if (!distribution) {
    return <></>;
  }

  const max = Math.max(...distribution);
  const normalizedDistribution = distribution.map(d => (100 * d) / max);

  return (
    <>
      <Text style={styles.subtitle}>ГІСТОРЫЯ ГУЛЬНЯЎ</Text>
      <View style={styles.guessDistributionContainer}>
        {normalizedDistribution.map((dist, index) => (
          <GuessDistributionLine
            key={`line-${index + 1}`}
            position={index + 1}
            amount={distribution[index]}
            percentage={dist}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: colors.lightgrey,
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 15,
  },
  guessDistributionContainer: {
    justifyContent: 'flex-start',
    width: '100%',
    padding: 20,
  },
});

export default GuessDistribution;
