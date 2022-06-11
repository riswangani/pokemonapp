import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {COLORS} from '../Styles/Color';
import {pokeball} from '../icons';

const PokemonCard = props => {
  const navigation = props.navigation;

  const actionCard = () => {
    if (props.pokeBag) {
      props.rightAction();
    } else {
      navigation.navigate('PokemonDetail', {url: props.item.url});
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => actionCard()}>
      <View style={{flexDirection: 'row'}}>
        <Image
          style={{marginLeft: 10, width: 20, height: 20, resizeMode: 'contain'}}
          source={pokeball}
        />
        <View style={{flexDirection: 'column', flex: 1}}>
          <Text style={styles.nameCard}>{props.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '50%',
    marginLeft: 5,
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'center',
    height: 50,
  },
  nameCard: {
    fontSize: 14,
    color: COLORS.blackProgress,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PokemonCard;
