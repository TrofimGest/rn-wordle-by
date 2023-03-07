import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {colors, CLEAR, ENTER} from './src/constants';
import Keyboard from './src/components/Keyboard';

const NUMBER_OF_ROWS = 6;

const copyArray = arr => {
  return [...arr.map(rows => [...rows])];
};

function App(): JSX.Element {
  const word = 'helow';
  const letters = word.split('');
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_ROWS).fill(new Array(letters.length).fill('')),
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);

  const onKeyPressed = (key: string[]) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>ЎОРДЛІ</Text>
      <View style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row:${i}`} style={styles.row}>
            {row.map((cell: string, j: number) => (
              <View
                key={`cell:${i}:${j}`}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j)
                      ? colors.grey
                      : colors.darkgrey,
                  },
                ]}>
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <Keyboard onKeyPressed={onKeyPressed} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 7,
  },
  map: {
    alignSelf: 'stretch',
    marginVertical: 20,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    borderWidth: 3,
    borderColor: colors.darkgrey,
    flex: 1,
    maxWidth: 70,
    aspectRatio: 1,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: 'bold',
    fontSize: 28,
  },
});

export default App;
