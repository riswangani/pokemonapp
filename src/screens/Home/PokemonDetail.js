import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import {COLORS} from '../../Styles/Color';
import Header from '../../components/Header';
import {useQuery} from 'react-query';
import CatchPokemon from '../../components/CatchPokemon';
import database from '@react-native-firebase/database';

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
            <Text>{item.move.name}, </Text>
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
        renderItem={({item, index}) => <Text>{item.type.name}, </Text>}
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
        renderItem={({item, index}) => <Text>{item.ability.name}, </Text>}
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
    <VirtualizedScrollView>
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
              <Text
                style={{
                  fontSize: 24,
                  color: COLORS.blackProgress,
                  fontWeight: 'bold',
                  marginTop: 10,
                }}>
                {data?.name}
              </Text>
              <TouchableOpacity onPress={() => savePokemon()}>
                <Text
                  style={{
                    color: COLORS.orangeQonstanta,
                    fontWeight: 'bold',
                    fontSize: 16,
                    textDecorationLine: 'underline',
                    marginTop: 10,
                  }}>
                  Profile
                </Text>
              </TouchableOpacity>
              <View style={{flexDirection: 'row', margin: 10}}>
                <View style={{flexDirection: 'column', flex: 1}}>
                  <Text>Height : {data?.height} </Text>
                  <Text>Weight : {data?.weight}</Text>
                  <Text>Species : {data?.species?.name}</Text>
                </View>
              </View>
            </View>
            <View style={{margin: 10}}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: COLORS.blackProgress,
                }}>
                Type
              </Text>
              {renderType()}
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: COLORS.blackProgress,
                }}>
                Ability
              </Text>
              {renderAbility()}
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: COLORS.blackProgress,
                }}>
                Moves
              </Text>
              {toggle === false ? (
                <TouchableOpacity onPress={() => setToogle(true)}>
                  <Text>Lihat semua moves </Text>
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
    </VirtualizedScrollView>
  );
};
export default PokemonDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: COLORS.white,
  },
});
