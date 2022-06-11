import {StyleSheet, Text, View, Dimensions, TextInput} from 'react-native';
import React from 'react';
import {COLORS} from '../Styles/Color';

const Input = ({onChangeText, value, placeHolder, error}) => {
  const win = Dimensions.width;

  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeHolder}
        />
      </View>
      <View>
        <Text style={{color: 'red', marginBottom: 5}}>{error}</Text>
      </View>
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 30,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginBottom: 10,
    elevation: 2,
    borderColor: COLORS.green,
    borderWidth: 2,
    width: '90%',
  },
  inputs: {
    borderBottomColor: COLORS.white,
    color: COLORS.black,
    paddingLeft: 10,
    flex: 1,
  },
});
