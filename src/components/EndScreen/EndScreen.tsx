import React, {useState, useEffect, useMemo} from 'react';
import {
  SafeAreaView,
  Pressable,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {SlideInLeft} from 'react-native-reanimated';
import Clipboard from '@react-native-clipboard/clipboard';
import Number from './Number/Number';
import GuessDistribution from './GuessDistribution/GuessDistribution';
import {GameData} from '../../types/types';
import {colorsToEmoji} from '../../constants';
import styles from './EndScreen.styles';

type EndScreenProps = {
  won: boolean;
  rows: string[][];
  getCellBGColor: (i: number, j: number) => string;
  wordOfTheDay: string;
};

const EndScreen: React.FC<EndScreenProps> = ({
  won,
  rows,
  getCellBGColor,
  wordOfTheDay,
}) => {
  const [secondsTillTomorrow, setSecondsTillTomorrow] = useState<number>(0);
  const [played, setPlayed] = useState<number>(0);
  const [winRate, setWinRate] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [distribution, setDistribution] = useState<Array<number>>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      readStates();
    }, 200); // delay for 0.2 second
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    const updateTime = (): void => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      setSecondsTillTomorrow((tomorrow.getTime() - now.getTime()) / 1000); //seconds
    };
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSeconds = useMemo(() => {
    const timeComponents: Array<number> = [
      Math.floor(secondsTillTomorrow / (60 * 60)), //hours
      Math.floor((secondsTillTomorrow % (60 * 60)) / 60), //minutes
      Math.floor(secondsTillTomorrow % 60), //seconds
    ];
    const formattedTimeComponents: Array<string> = timeComponents.map(
      (component: number): string =>
        component < 10 ? `0${component}` : `${component}`,
    );
    const formattedTime = formattedTimeComponents.join(':');
    return formattedTime;
  }, [secondsTillTomorrow]);

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
    try {
      const stringifiedData = await AsyncStorage.getItem('@gameStates');
      if (!stringifiedData) {
        return;
      }
      const data: GameData = JSON.parse(stringifiedData);
      const keys: Array<string> = Object.keys(data);
      const values = Object.values(data);
      const numberOfWins: number = values.filter(
        game => game.gameState === 'won',
      ).length;

      let currentGameStreak: number = 0;
      let maxGameStreak: number = 0;
      let previousDay: number = 0;

      //counting current streak and max streak for stats
      keys.forEach((key: string): void => {
        const day = parseInt(key.split('-')[1], 10);
        if (data[key].gameState === 'won' && currentGameStreak === 0) {
          currentGameStreak += 1;
        } else if (data[key].gameState === 'won' && previousDay + 1 === day) {
          currentGameStreak += 1;
        }
        currentGameStreak = data[key].gameState === 'won' ? 1 : 0;

        if (currentGameStreak > maxGameStreak) {
          maxGameStreak = currentGameStreak;
        }
        previousDay = day;
      });
      setPlayed(keys.length);
      setWinRate(Math.floor((100 * numberOfWins) / keys.length));
      setCurrentStreak(currentGameStreak);
      setMaxStreak(maxGameStreak);

      //guess distribution

      const dist = [0, 0, 0, 0, 0, 0]; //number of lines/tries (6)

      values.forEach(game => {
        if (game.gameState === 'won') {
          const tries = game.rows.filter(
            (row: Array<boolean>) => row[0],
          ).length;
          dist[tries - 1] = dist[tries - 1] + 1;
        }
      });
      setDistribution(dist);
      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (!loaded) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView>
      <Animated.Text
        entering={SlideInLeft.delay(100).springify().mass(0.4)}
        style={styles.title}>
        {won ? 'ВІНШУЮ!' : 'Паспрабуй заўтра'}
      </Animated.Text>
      <Animated.Text
        entering={SlideInLeft.delay(100).springify().mass(0.4)}
        style={styles.title}>
        Слова дня - {wordOfTheDay.toUpperCase()}
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
      <Animated.View
        style={styles.guessDistributionMarginContainer}
        entering={SlideInLeft.delay(150).springify().mass(0.4)}>
        <GuessDistribution distribution={distribution} />
      </Animated.View>
      <Animated.View
        entering={SlideInLeft.delay(200).springify().mass(0.4)}
        style={styles.miscContainer}>
        <View style={styles.nextWordleContainer}>
          <Text style={styles.nextWordleText}>Наступнае слова дня</Text>
          <Text style={styles.nextWordleTime}>{formatSeconds}</Text>
        </View>
        <Pressable style={styles.shareButton} onPress={shareScore}>
          <Text style={styles.shareButtonText}>Падзяліцца</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
};

export default EndScreen;
