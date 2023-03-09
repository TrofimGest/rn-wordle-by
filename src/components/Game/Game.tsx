import React, {useState, useEffect} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors, CLEAR, ENTER} from '../../constants';
import styles from './Game.styles';
import Keyboard from '../Keyboard';
import dictionary from '../../dictionary';
import {getDayOfTheYear, copyArray, getDayKey} from '../../utils';
import EndScreen from '../EndScreen';
import Animated, {SlideInLeft} from 'react-native-reanimated';

const NUMBER_OF_ROWS = 6;
const dayOfTheYear = getDayOfTheYear();
const dayKey = getDayKey();

const Game = (): JSX.Element => {
  //AsyncStorage.removeItem('@gameStates');
  const word = dictionary[dayOfTheYear];
  const letters = word.split('');
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_ROWS).fill(new Array(letters.length).fill('')),
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);
  const [gameState, setGameState] = useState('playing'); // won, lost, playing
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (currentRow > 0) {
      checkGameState();
    }
  }, [currentRow]);

  useEffect(() => {
    if (loaded) {
      storeStates();
    }
  }, [rows, currentColumn, currentRow, gameState]);

  useEffect(() => {
    readStates();
  }, []);

  const storeStates = async () => {
    //rows, currentRow, currentColumn, gameState

    const dataForToday = {
      rows,
      currentRow,
      currentColumn,
      gameState,
    };
    try {
      const stringifiedExistingStates = await AsyncStorage.getItem(
        '@gameStates',
      );
      const existingStates = stringifiedExistingStates
        ? JSON.parse(stringifiedExistingStates)
        : {};
      existingStates[dayKey] = dataForToday;
      const stringifiedData = JSON.stringify(existingStates);
      await AsyncStorage.setItem('@gameStates', stringifiedData);
    } catch (error) {
      console.log(error);
    }
  };

  const readStates = async () => {
    try {
      const stringifiedData = await AsyncStorage.getItem('@gameStates');
      const data = JSON.parse(stringifiedData);
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

  const checkGameState = () => {
    if (checkIfWon() && gameState !== 'won') {
      setGameState('won');
    } else if (checkIfLost() && gameState !== 'lost') {
      setGameState('lost');
    }
  };

  const checkIfWon = () => {
    const row = rows[currentRow - 1];
    return row.every((letter, i) => letter === letters[i]);
  };

  const checkIfLost = () => {
    return !checkIfWon() && currentRow === rows.length;
  };

  const onKeyPressed = key => {
    if (gameState !== 'playing') {
      return;
    }
    const updatedRows = copyArray(rows);

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
        setCurrentRow(currentRow + 1);
        setCurrentColumn(0);
      }
      return;
    }

    if (currentColumn < rows[0].length) {
      updatedRows[currentRow][currentColumn] = key;
      setRows(updatedRows);
      setCurrentColumn(currentColumn + 1);
    }
  };

  const isCellActive = (row, column) => {
    return row === currentRow && column === currentColumn;
  };

  const getCellBGColor = (row, column) => {
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

  const getAllLettersWithColor = color => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBGColor(i, j) === color),
    );
  };

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);

  if (!loaded) {
    return <ActivityIndicator />;
  }

  if (gameState !== 'playing') {
    return (
      <EndScreen
        won={gameState === 'won'}
        rows={rows}
        getCellBGColor={getCellBGColor}
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
