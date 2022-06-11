import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import PokemonCard from '../../components/PokemonCard';
import {COLORS} from '../../Styles/Color';
import {useQuery} from 'react-query';
import Header from '../../components/Header';

const Dashboard = props => {
  const navigation = props.navigation;

  const [nextPage, setNextpage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPokemon = nextPage =>
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${nextPage}&limit=20`).then(
      res => res.json(),
    );

  const {isLoading, isError, error, data} = useQuery(
    ['pokemon', nextPage],
    () => fetchPokemon(nextPage),
    {keepPreviousData: true},
  );

  const onHandleNext = () => {
    setNextpage(nextPage + 10);
    setCurrentPage(currentPage + 1);
  };

  const onHandlePrevious = () => {
    setNextpage(nextPage - 10), setCurrentPage(currentPage - 1);
  };

  const Footer = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          margin: 10,
        }}>
        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => onHandlePrevious()}
          style={{
            width: '45%',
            height: 50,
            borderRadius: 10,
            borderColor: COLORS.orangeQonstanta,
            backgroundColor: COLORS.orangeQonstanta,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: COLORS.white}}>Sebelumnya</Text>
        </TouchableOpacity>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>{currentPage}</Text>
        </View>
        <TouchableOpacity
          disabled={data?.hasMore}
          onPress={() => onHandleNext()}
          style={{
            width: '45%',
            height: 50,
            borderRadius: 10,
            borderColor: COLORS.blueQonstanta,
            backgroundColor: COLORS.blueQonstanta,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={{color: COLORS.white}}>Berikutnya</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderListPokemon = () => {
    return (
      <FlatList
        style={{margin: 8}}
        numColumns={2}
        data={data?.results}
        renderItem={({item, index}) => (
          <PokemonCard name={item.name} item={item} navigation={navigation} />
        )}
        columnWrapperStyle={{
          margin: 5,
        }}
        ListFooterComponent={Footer}
        listKey={(item, index) => `_key${index.toString()}`}
      />
    );
  };

  return (
    <View>
      <Header
        home
        pageName={'PokeDex'}
        pokeBag
        rightAction={() => navigation.navigate('PokeBag')}
      />
      <View style={{margin: 10}}>
        <Text style={{fontSize: 24, color: 'black'}}>Pokedex</Text>
      </View>

      {isError ? (
        <Text>{error}</Text>
      ) : isLoading ? (
        <ActivityIndicator size={30} color={COLORS.blueQonstanta} />
      ) : (
        renderListPokemon()
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
