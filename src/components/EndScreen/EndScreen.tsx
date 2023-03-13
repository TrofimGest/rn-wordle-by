import {
  SafeAreaView,
  Pressable,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {SlideInLeft} from 'react-native-reanimated';
import Clipboard from '@react-native-clipboard/clipboard';
import {colorsToEmoji} from '../../constants';
import styles from './EndScreen.styles';

type NumberProps = {
  number: number;
  label: string;
};

const Number = ({number, label}: NumberProps) => (
  <View style={styles.numberContainer}>
    <Text style={styles.number}>{number}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

type GuessDistributionLineProps = {
  position: number;
  amount: number;
  percentage: number;
};

const GuessDistributionLine = ({
  position,
  amount,
  percentage,
}: GuessDistributionLineProps) => {
  return (
    <View style={styles.positionContainer}>
      <Text style={styles.position}>{position}</Text>
      <View style={[styles.amountContainer, {width: `${percentage}%`}]}>
        <Text style={styles.amount}>{amount}</Text>
      </View>
    </View>
  );
};

type GuessDistributionProps = {
  distribution: number[];
};

const GuessDistribution = ({distribution}: GuessDistributionProps) => {
  if (!distribution) {
    return <></>;
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

type EndScreenProps = {
  won: boolean;
  rows: string[][];
  getCellBGColor: (i: number, j: number) => string;
};

interface GameState {
  gameState: string;
  rows: Array<Array<boolean>>;
}

interface GameData {
  [key: string]: GameState;
}

const EndScreen = ({won = false, rows, getCellBGColor}: EndScreenProps) => {
  const [secondsTillTommorow, setSecondsTillTommorow] = useState<number>(0);
  const [played, setPlayed] = useState<number>(0);
  const [winRate, setWinRate] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [distribution, setDistribution] = useState<Array<number>>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    readStates();
  }, []);

  useEffect(() => {
    const updateTime = (): void => {
      const now = new Date();
      const tommorow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      setSecondsTillTommorow((tommorow.getTime() - now.getTime()) / 1000); //seconds
    };
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSeconds = () => {
    const timeComponents: Array<number> = [
      Math.floor(secondsTillTommorow / (60 * 60)), //hours
      Math.floor((secondsTillTommorow % (60 * 60)) / 60), //minutes
      Math.floor(secondsTillTommorow % 60), //seconds
    ];
    const formattedTimeComponents: Array<string> = timeComponents.map(
      (component: number): string =>
        component < 10 ? `0${component}` : `${component}`,
    );

    return formattedTimeComponents.join(':');
  };

  const shareScore = (): void => {
    const textMap: string = rows
      .map((row, i: number): string =>
        row
          .map((j: string) => colorsToEmoji[getCellBGColor(i, parseInt(j, 10))])
          .join(''),
      )
      .filter((row: string): string => row)
      .join('\n');
    const textToShare: string = `ЎОРДЛІ \n${textMap}`;
    Clipboard.setString(textToShare);
    Alert.alert(
      'Скапіявана паспяхова',
      'Падзяліся вынікам у сваіх сацыяльных сетках',
    );
  };

  const readStates = async (): Promise<void> => {
    let data: GameData = {};
    try {
      const stringifiedData = await AsyncStorage.getItem('@gameStates');
      if (stringifiedData) {
        data = JSON.parse(stringifiedData);
      }
    } catch (error) {
      console.log(error);
    }

    const keys: Array<string> = Object.keys(data || {});
    const values = Object.values(data || {});
    const numberOfWins: number = values.filter(
      game => game.gameState === 'won',
    ).length;
    let _currentStreak: number = 0;
    let _maxStreak: number = 0;
    let previousDay: number = 0;

    //counting current streak and max streak for stats
    keys.forEach((key: string): void => {
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
    setMaxStreak(_maxStreak);
    setLoaded(true);

    //guess distributoin

    const dist = [0, 0, 0, 0, 0, 0]; //number of lines/tries (6)

    values.forEach(game => {
      if (game.gameState === 'won') {
        const tries = game.rows.filter((row: Array<boolean>) => row[0]).length;
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
