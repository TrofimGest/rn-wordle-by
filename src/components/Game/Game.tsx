import React, {useState, useEffect} from 'react';
import {Text, View, Alert} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {colors, CLEAR, ENTER, colorsToEmoji} from '../../constants';
import styles from './Game.styles';
import Keyboard from '../../components/Keyboard';
import dictionary from '../../dictionary';
import {getDayOfTheYear, copyArray} from '../../utils';

const NUMBER_OF_ROWS = 6;
const dayOfTheYear = getDayOfTheYear();

const Game = (): JSX.Element => {
  const word = dictionary[dayOfTheYear];
  const letters = word.split('');
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_ROWS).fill(new Array(letters.length).fill('')),
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);
  const [gameState, setGameState] = useState('playing'); // won, lost, playing

  useEffect(() => {
    if (currentRow > 0) {
      checkGameState();
    }
  }, [currentRow]);

  const checkGameState = () => {
    if (checkIfWon() && gameState !== 'won') {
      Alert.alert('Huraaay', 'You won!', [
        {text: 'Share', onPress: shareScore},
      ]);
      setGameState('won');
    } else if (checkIfLost() && gameState !== 'lost') {
      Alert.alert('Meh', 'Try again tomorrow!');
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

  const onKeyPressed = (key: string[]) => {
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

  return (
    <>
      <View style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row:${i}`} style={styles.row}>
            {row.map((letter: string, j: number) => (
              <View
                key={`cell:${i}:${j}`}
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
          </View>
        ))}
      </View>
      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </>
  );
};

export default Game;