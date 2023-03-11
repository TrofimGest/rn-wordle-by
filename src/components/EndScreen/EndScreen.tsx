import {
  SafeAreaView,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {SlideInLeft} from 'react-native-reanimated';
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

const GuessDistribution = ({distribution}) => {
  if (!distribution) {
    return;
  }
  const sum = distribution.reduce((acc, dist) => dist + acc, 0);
  return (
    <>
      <Text style={styles.subtitle}>ГІСТОРЫЯ ГУЛЬНЯЎ</Text>
      <View style={styles.guessDistributionContainer}>
        {distribution.map((dist, index) => (
          <GuessDistributionLine
            key={`line-${index + 1}`}
            position={index + 1}
            amount={dist}
            percentage={(100 * sum) / dist}
          />
        ))}
      </View>
    </>
  );
};

const EndScreen = ({won = false, rows, getCellBGColor}) => {
  const [secondsTillTommorow, setSecondsTillTommorow] = useState(0);
  const [played, setPlayed] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, SetMaxStreak] = useState(0);
  const [distribution, setDistribution] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    readStates();
  }, []);

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
    const timeComponents = [
      Math.floor(secondsTillTommorow / (60 * 60)),
      Math.floor((secondsTillTommorow % (60 * 60)) / 60),
      Math.floor(secondsTillTommorow % 60),
    ];
    const formattedTimeComponents = timeComponents.map(component =>
      component < 10 ? `0${component}` : component,
    );

    return formattedTimeComponents.join(':');
  };

  const shareScore = () => {
    const textMap = rows
      .map((row, i) =>
        row.map(j => colorsToEmoji[getCellBGColor(i, j)]).join(''),
      )
      .filter(row => row)
      .join('\n');
    const textToShare = `ЎОРДЛІ \n${textMap}`;
    Clipboard.setString(textToShare);
    Alert.alert(
      'Скапіявана паспяхова',
      'Падзяліся вынікам у сваіх сацыяльных сетках',
    );
  };

  const readStates = async () => {
    let data;
    try {
      const stringifiedData = await AsyncStorage.getItem('@gameStates');
      data = JSON.parse(stringifiedData);
    } catch (error) {
      console.log(error);
    }
    const keys = Object.keys(data);
    const values = Object.values(data);
    const numberOfWins = values.filter(game => game.gameState === 'won').length;
    let _currentStreak = 0;
    let _maxStreak = 0;
    let previousDay = 0;

    //counting current streak and max streak for stats
    keys.forEach(key => {
      const day = parseInt(key.split('-')[1], 10);
      if (data[key].gameState === 'won' && _currentStreak === 0) {
        _currentStreak += 1;
      } else if (data[key].gameState === 'won' && previousDay + 1 === day) {
        _currentStreak += 1;
      } else {
        if (_currentStreak > _maxStreak) {
          _maxStreak = _currentStreak;
        }
        _currentStreak = data[key].gameState === 'won' ? 1 : 0;
      }
      previousDay = day;
    });
    setPlayed(keys.length);
    setWinRate(Math.floor((100 * numberOfWins) / keys.length));
    setCurrentStreak(_currentStreak);
    SetMaxStreak(_currentStreak);
    setLoaded(true);

    //guess distributoin

    const dist = [0, 0, 0, 0, 0, 0]; //number of lines/tries (6)

    values.map(game => {
      if (game.gameState === 'won') {
        const tries = game.rows.filter(row => row[0]).length;
        dist[tries] = dist[tries] + 1;
      }
    });
    setDistribution(dist);
  };

  if (!loaded) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView>
      <Animated.Text
        entering={SlideInLeft.delay(100).springify().mass(0.4)}
        style={styles.title}>
        {won ? 'Віншую!' : 'Паспрабуй заўтра'}
      </Animated.Text>
      <Animated.Text
        entering={SlideInLeft.delay(100).springify().mass(0.4)}
        style={styles.subtitle}>
        СТАТЫСТЫКА
      </Animated.Text>
      <Animated.View
        entering={SlideInLeft.delay(100).springify().mass(0.4)}
        style={styles.statisticsContainer}>
        <Number number={played} label={'Усяго гульняў'} />
        <Number number={winRate} label={'% перамог'} />
        <Number number={currentStreak} label={'Бягучая серыя'} />
        <Number number={maxStreak} label={'Найлепшая серыя'} />
      </Animated.View>
      <Animated.View entering={SlideInLeft.delay(150).springify().mass(0.4)}>
        <GuessDistribution distribution={distribution} />
      </Animated.View>
      <Animated.View
        entering={SlideInLeft.delay(200).springify().mass(0.4)}
        style={styles.miscContainer}>
        <View style={styles.nextWordleContainer}>
          <Text style={styles.nextWordleText}>Наступнае слова дня</Text>
          <Text style={styles.nextWordleTime}>{formatSeconds()}</Text>
        </View>
        <Pressable style={styles.shareButton} onPress={shareScore}>
          <Text style={styles.shareButtonText}>Падзяліцца</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
};

export default EndScreen;

const styles = StyleSheet.create({
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
