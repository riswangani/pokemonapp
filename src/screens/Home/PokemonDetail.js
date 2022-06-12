import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-virtualized-view';
import {COLORS} from '../../Styles/Color';
import Header from '../../components/Header';
import {useQuery} from 'react-query';
import CatchPokemon from '../../components/CatchPokemon';
import database from '@react-native-firebase/database';
import {FONTS} from '../../Styles/Font';

const VirtualizedScrollView = props => {
  return (
    <FlatList
      {...props}
      data={[]}
      keyExtractor={(e, i) => 'dom' + i.toString()}
      ListEmptyComponent={null}
      renderItem={null}
      ListHeaderComponent={() => <>{props.children}</>}
    />
  );
};

const PokemonDetail = props => {
  const navigation = props.navigation;
  const {params} = props.route;
  const url = params ? params.url : null;

  const [toggle, setToogle] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [disableCatch, setDisableCatch] = useState(false);
  const [pokeBag, setPokeBag] = useState([]);

  const spinValue = useState(new Animated.Value(0))[0];

  const spinPokemon = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const savePokemon = () => {
    const reference = database().ref('/pokeBag');
    const ratio = Math.floor(Math.random() * 11);

    try {
      if (ratio > 5) {
        reference.push({name: data?.name});
        spinPokemon();
        setDisableCatch(true);
        Alert.alert('Success', 'Berhasil Menangkap');
      } else {
        Alert.alert('Oops', 'Gagal Menangkap');
      }
    } catch (error) {
      Alert.alert('Oops', 'Gagal Menyimpan Ke PokeBag');
    }
  };

  useEffect(() => {
    const reference = database().ref('/pokeBag');
    reference.on('value', snapshot => {
      setPokeBag(snapshot.val());
      checkPokemon(snapshot.val());
    });
  }, []);

  const fetchPokemonDetail = url => fetch(url).then(res => res.json());
  const {isLoading, data} = useQuery('pokemonDetail', () =>
    fetchPokemonDetail(url),
  );

  const checkPokemon = item => {
    let keyFirebase = [];
    keyFirebase = Object.keys(item);
    for (let i = 0; i < keyFirebase.length; i++) {
      if (item[keyFirebase[i]].name.includes(data?.name)) {
        setDisableCatch(true);
      }
    }
  };

  const renderMoves = () => {
    return (
      <FlatList
        numColumns={4}
        style={{margin: 8}}
        data={data?.moves}
        columnWrapperStyle={{
          margin: 5,
        }}
        renderItem={({item, index}) => (
          <View>
            <Text
              style={{color: COLORS.blackProgress, fontFamily: FONTS.Regular}}>
              {item.move.name},{' '}
            </Text>
          </View>
        )}
        listKey={(item, index) => `_key${index.toString()}`}
      />
    );
  };

  const renderType = () => {
    return (
      <FlatList
        numColumns={4}
        style={{margin: 8}}
        data={data?.types}
        columnWrapperStyle={{
          margin: 5,
        }}
        renderItem={({item, index}) => (
          <Text
            style={{color: COLORS.blackProgress, fontFamily: FONTS.Regular}}>
            {item.type.name},{' '}
          </Text>
        )}
        listKey={(item, index) => `_key${index.toString()}`}
      />
    );
  };

  const renderAbility = () => {
    return (
      <FlatList
        numColumns={4}
        style={{margin: 8}}
        data={data?.abilities}
        columnWrapperStyle={{
          margin: 5,
        }}
        renderItem={({item, index}) => (
          <Text
            style={{color: COLORS.blackProgress, fontFamily: FONTS.Regular}}>
            {item.ability.name},{' '}
          </Text>
        )}
        listKey={(item, index) => `_key${index.toString()}`}
      />
    );
  };

  const onOpenModal = () => {
    setModalVisible(!modalVisible);
  };

  const spinImage = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <Header
          back
          backAction={() => navigation.goBack()}
          pageName="Pokemon Detail"
          catch
          disableCatch={disableCatch}
          rightAction={() => onOpenModal()}
        />
        {isLoading ? (
          <ActivityIndicator color={COLORS.orangeQonstanta} />
        ) : (
          <>
            <View style={{alignItems: 'center', margin: 10}}>
              <TouchableOpacity onPress={spinPokemon}>
                <Animated.Image
                  style={{
                    width: 200,
                    height: 200,
                    resizeMode: 'contain',
                    borderRadius: 8,
                    transform: [{rotate: spinImage}],
                  }}
                  source={{uri: data?.sprites?.other?.home?.front_default}}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={spinPokemon}>
                <Text
                  style={{
                    fontSize: 24,
                    color: COLORS.blackProgress,
                    fontWeight: 'bold',
                    marginTop: 10,
                  }}>
                  {data?.name}
                </Text>
              </TouchableOpacity>
              <View style={{flexDirection: 'row', margin: 10}}>
                <View style={{flexDirection: 'column', flex: 1}}>
                  <Text
                    style={{
                      color: COLORS.blackProgress,
                      fontFamily: FONTS.Regular,
                    }}>
                    Height : {data?.height}{' '}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.blackProgress,
                      fontFamily: FONTS.Regular,
                    }}>
                    Weight : {data?.weight}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.blackProgress,
                      fontFamily: FONTS.Regular,
                    }}>
                    Species : {data?.species?.name}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{margin: 10}}>
              <Text
                style={{
                  fontFamily: FONTS.SemiBold,
                  fontSize: 25,
                  color: COLORS.blueMetronic,
                }}>
                Type
              </Text>
              {renderType()}
              <Text
                style={{
                  fontSize: 25,
                  fontFamily: FONTS.SemiBold,
                  color: COLORS.blueMetronic,
                }}>
                Ability
              </Text>
              {renderAbility()}
              <Text
                style={{
                  fontSize: 25,
                  fontFamily: FONTS.SemiBold,
                  color: COLORS.blueMetronic,
                }}>
                Moves
              </Text>
              {toggle === false ? (
                <TouchableOpacity onPress={() => setToogle(true)}>
                  <Text
                    style={{
                      color: COLORS.blackProgress,
                      fontFamily: FONTS.Regular,
                    }}>
                    Lihat semua moves{' '}
                  </Text>
                </TouchableOpacity>
              ) : (
                renderMoves()
              )}
            </View>
          </>
        )}

        <CatchPokemon
          onOpenModal={onOpenModal}
          modalVisible={modalVisible}
          onCatchPokemon={savePokemon}
        />
      </View>
    </ScrollView>
  );
};
export default PokemonDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: COLORS.white,
  },
});
