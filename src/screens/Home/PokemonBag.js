import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../../components/Header';

const PokemonBag = props => {
  const navigation = props.navigation;

  return (
    <View>
      <Header
        pageName={'PokeBag'}
        back
        backAction={() => navigation.goBack()}
      />
    </View>
  );
};

export default PokemonBag;

const styles = StyleSheet.create({});
