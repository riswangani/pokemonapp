import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Alert,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import Header from '../../components/Header';
import PokemonCard from '../../components/PokemonCard';
import {COLORS} from '../../Styles/Color';

const PokemonBag = props => {
  const navigation = props.navigation;
  const [pokeBag, setPokeBag] = useState([]);
  const [key, setKey] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState('');

  useEffect(() => {
    fetchPokeBagData();
  }, []);

  const fetchPokeBagData = () => {
    setLoading(true);
    const reference = database().ref('/pokeBag');
    reference.on('value', snapshot => {
      GetData(snapshot.val());
      setLoading(false);
    });
  };

  const GetData = data => {
    let keyFirebase = [];
    keyFirebase = Object.keys(data);
    setKey(keyFirebase);
    setPokeBag(data);
  };

  const openModal = item => {
    setId(item);
    setModalVisible(true);
  };

  const removePokemon = async () => {
    try {
      await database().ref(`/pokeBag/${id}`).remove();
      fetchPokeBagData();
      setModalVisible(false);
      Alert.alert('Succes', `Berhasil Menghapus ${pokeBag[id].name}`);
    } catch (error) {
      Alert.alert('Oops', error);
    }
  };

  return (
    <View>
      <Header
        pageName={'PokeBag'}
        back
        backAction={() => navigation.goBack()}
      />
      {loading ? (
        <ActivityIndicator color={COLORS.orangeQonstanta} />
      ) : (
        <FlatList
          style={{margin: 8}}
          numColumns={2}
          data={key}
          renderItem={({item, index}) => (
            <PokemonCard
              name={pokeBag[item]?.name}
              item={item}
              pokeBag
              rightAction={() => openModal(item)}
            />
          )}
          columnWrapperStyle={{
            margin: 5,
          }}
          listKey={(item, index) => `_key${index.toString()}`}
        />
      )}

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent>
        <View style={styles.containerModal}>
          <View style={styles.containerTop}>
            <Text style={{fontSize: 16, textAlign: 'center'}}>
              Ingin Menghapus Pokemon {pokeBag[id]?.name} dari Pokebag ??
            </Text>
            <View style={{flexDirection: 'row', margin: 10}}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}>
                <Text style={{fontSize: 14, color: COLORS.white}}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removePokemon()}
                style={styles.deleteButton}>
                <Text style={{fontSize: 14, color: COLORS.white}}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PokemonBag;

const styles = StyleSheet.create({
  containerModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  containerTop: {
    backgroundColor: 'white',
    paddingTop: 12,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    paddingBottom: 20,
    alignItems: 'center',
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginRight: 5,
    width: '40%',
    backgroundColor: COLORS.button,
    height: 40,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginLeft: 5,
    width: '40%',
    backgroundColor: COLORS.trackingDelivered,
    height: 40,
  },
});
