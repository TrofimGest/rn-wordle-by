import React, {useState, useEffect} from 'react';
import {Text, View, ActivityIndicator, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {SlideInLeft} from 'react-native-reanimated';
import Keyboard from '../Keyboard';
import EndScreen from '../EndScreen';
import {GameCondition, GameDataState} from '../../types/types';
import {possibleTasks, allowedGuesses} from '../../dictionary';
import {getWordIndex, copyArray, getDayKey} from '../../utils';
import {colors, CLEAR, ENTER} from '../../constants';
import styles from './Game.styles';

const NUMBER_OF_ROWS = 6;
const wordIndex = getWordIndex();
const dayKey = getDayKey();

const Game: React.FC = () => {
  //AsyncStorage.removeItem('@gameStates');
  const word = possibleTasks[wordIndex];
  const letters = word.split('');
  const [rows, setRows] = useState<string[][]>(
    new Array(NUMBER_OF_ROWS).fill(new Array(letters.length).fill('')),
  );
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentColumn, setCurrentColumn] = useState<number>(0);
  const [gameState, setGameState] = useState<GameCondition>(
    GameCondition.PLAYING,
  );
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (currentRow > 0) {
      checkGameState();
    }
  }, [currentRow]);

  useEffect(() => {
    if (loaded) {
      storeStates();
    }
  }, [rows, currentColumn, currentRow, gameState, loaded, dayKey]);

  useEffect(() => {
    readStates();
  }, []);

  const storeStates = async (): Promise<void> => {
    //rows, currentRow, currentColumn, gameState

    const dataForToday: GameDataState = {
      rows,
      currentRow,
      currentColumn,
      gameState,
    };
    try {
      const stringifiedExistingStates = await AsyncStorage.getItem(
        '@gameStates',
      );
      const existingStates: Record<string, GameDataState> =
        stringifiedExistingStates ? JSON.parse(stringifiedExistingStates) : {};
      existingStates[dayKey] = dataForToday;
      const stringifiedData = JSON.stringify(existingStates);
      await AsyncStorage.setItem('@gameStates', stringifiedData);
    } catch (error) {
      console.log(error);
    }
  };

  const readStates = async (): Promise<void> => {
    try {
      const stringifiedData = await AsyncStorage.getItem('@gameStates');
      const data = JSON.parse(stringifiedData || '{}');
      const day = data[dayKey];
      setRows(day.rows);
      setCurrentColumn(day.currentColumn);
      setCurrentRow(day.currentRow);
      setGameState(day.gameState);
    } catch (error) {
      console.log(error);
    }

    setLoaded(true);
  };

  const checkGameState = (): void => {
    if (checkIfWon() && gameState !== GameCondition.WON) {
      setGameState(GameCondition.WON);
    } else if (checkIfLost() && gameState !== GameCondition.LOST) {
      setGameState(GameCondition.LOST);
    }
  };

  const checkIfWon = (): boolean => {
    const row = rows[currentRow - 1];
    return row.every((letter, i) => letter === letters[i]);
  };

  const checkIfLost = (): boolean => {
    return !checkIfWon() && currentRow === rows.length;
  };

  const onKeyPressed = (key: string): void => {
    if (gameState !== GameCondition.PLAYING) {
      return;
    }
    const updatedRows: string[][] = copyArray(rows);

    if (key === CLEAR) {
      const previousColumn = currentColumn - 1;
      if (previousColumn >= 0) {
        updatedRows[currentRow][previousColumn] = '';
        setRows(updatedRows);
        setCurrentColumn(previousColumn);
      }
      return;
    }

    if (key === ENTER) {
      if (currentColumn === rows[0].length) {
        const rowValue = rows[currentRow].join('');
        if (
          !allowedGuesses.includes(rowValue) &&
          !possibleTasks.includes(rowValue)
        ) {
          Alert.alert('Гэтае слова мне невядома');
        } else {
          setCurrentRow(currentRow + 1);
          setCurrentColumn(0);
        }
      }
      return;
    }

    if (currentColumn < rows[0].length) {
      updatedRows[currentRow][currentColumn] = key;
      setRows(updatedRows);
      setCurrentColumn(currentColumn + 1);
    }
  };

  const isCellActive = (row: number, column: number) => {
    return row === currentRow && column === currentColumn;
  };

  const getCellBGColor = (row: number, column: number) => {
    const letter = rows[row][column];

    if (row >= currentRow) {
      return colors.black;
    }
    if (letter === letters[column]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  const getAllLettersWithColor = (color: string): string[] => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBGColor(i, j) === color),
    );
  };

  const greenCaps: string[] = getAllLettersWithColor(colors.primary);
  const yellowCaps: string[] = getAllLettersWithColor(colors.secondary);
  const greyCaps: string[] = getAllLettersWithColor(colors.darkgrey);

  if (!loaded) {
    return <ActivityIndicator />;
  }

  if (gameState !== GameCondition.PLAYING) {
    return (
      <EndScreen
        won={gameState === GameCondition.WON}
        rows={rows}
        getCellBGColor={getCellBGColor}
        wordOfTheDay={word}
      />
    );
  }

  return (
    <>
      <View style={styles.map}>
        {rows.map((row, i) => (
          <Animated.View
            entering={SlideInLeft.delay(i * 30)}
            key={`row-${i}`}
            style={styles.row}>
            {row.map((letter, j) => (
              <View
                key={`cell-${i}-${j}`}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j)
                      ? colors.grey
                      : colors.darkgrey,
                    backgroundColor: getCellBGColor(i, j),
                  },
                ]}>
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </Animated.View>
        ))}
      </View>
      <Keyboard
        onKeyPressed={onKeyPressed}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
        greenCaps={greenCaps}
      />
    </>
  );
};

export default Game;
