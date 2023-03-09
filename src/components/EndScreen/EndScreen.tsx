import {Pressable, StyleSheet, Text, View, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {colors, colorsToEmoji} from '../../constants';

const Number = ({number, label}) => (
  <View style={styles.numberContainer}>
    <Text style={styles.number}>{number}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const GuessDistributionLine = ({position, amount, percentage}) => {
  return (
    <View style={styles.positionContainer}>
      <Text style={styles.position}>{position}</Text>
      <View style={[styles.amountContainer, {width: `${percentage}%`}]}>
        <Text style={styles.amount}>{amount}</Text>
      </View>
    </View>
  );
};

const GuessDistribution = () => {
  return (
    <>
      <Text style={styles.subtitle}>GUESS DISTRIBUTION</Text>
      <View style={styles.guessDistributionContainer}>
        <GuessDistributionLine position={0} amount={2} percentage={80} />
      </View>
    </>
  );
};

const EndScreen = ({won = false, rows, getCellBGColor}) => {
  const [secondsTillTommorow, setSecondsTillTommorow] = useState(0);

  const shareScore = () => {
    const textMap = rows
      .map((row, i) =>
        row.map(j => colorsToEmoji[getCellBGColor(i, j)]).join(''),
      )
      .filter(row => row)
      .join('\n');
    const textToShare = `Wordle \n${textMap}`;
    Clipboard.setString(textToShare);
    Alert.alert('Copied successfully', 'Share your score on you social media');
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tommorow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      setSecondsTillTommorow((tommorow - now) / 1000); //seconds
    };
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSeconds = () => {
    const hours = Math.floor(secondsTillTommorow / (60 * 60));
    const minutes = Math.floor((secondsTillTommorow % (60 * 60)) / 60);
    const seconds = Math.floor(secondsTillTommorow % 60);

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <View>
      <Text style={styles.title}>
        {won ? 'congrats' : 'try again tommorow'}
      </Text>
      <Text style={styles.subtitle}>STATS</Text>
      <View style={styles.statisticsContainer}>
        <Number number={3} label={'Played'} />
        <Number number={3} label={'Win %'} />
        <Number number={3} label={'Current streak'} />
        <Number number={3} label={'Max streak'} />
      </View>
      <GuessDistribution />
      <View style={styles.miscContainer}>
        <View style={styles.nextWordleContainer}>
          <Text style={styles.nextWordleText}>Next Wordle</Text>
          <Text style={styles.nextWordleTime}>{formatSeconds()}</Text>
        </View>
        <Pressable style={styles.shareButton} onPress={shareScore}>
          <Text style={styles.shareButtonText}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EndScreen;

const styles = StyleSheet.create({
  title: {
    color: colors.lightgrey,
    fontSize: 30,
    textAlign: 'center',
    marginVertical: 20,
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
