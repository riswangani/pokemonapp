import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {COLORS} from '../Styles/Color';
import {FONTS} from '../Styles/Font';
import {arrowBack} from '../icons';

const Header = props => {
  const navigation = props.navigation;
  // console.log(navigation);

  const renderLeftHead = () => {
    if (props.back) {
      return (
        <TouchableOpacity onPress={() => props.backAction()}>
          <Image
            style={{width: 25, height: 25, resizeMode: 'contain'}}
            source={arrowBack}
          />
        </TouchableOpacity>
      );
    } else if (props.home) {
      return (
        <View>
          <Text style={{color: COLORS.white, fontFamily: FONTS.title}}>
            Home
          </Text>
        </View>
      );
    }
  };

  const renderMidHead = () => {
    return (
      <Text
        style={{
          fontFamily: FONTS.extraBold,
          fontWeight: 'bold',
          fontSize: 16,
          color: COLORS.white,
        }}>
        {props.pageName}
      </Text>
    );
  };

  const renderRightHead = () => {
    if (props.catch) {
      return (
        <TouchableOpacity
          disabled={props.disableCatch}
          onPress={() => props.rightAction()}
          style={
            props.disableCatch ? styles.DissablebuttonCatch : styles.buttonCatch
          }>
          <Text style={{fontFamily: FONTS.title, color: COLORS.white}}>
            Catch
          </Text>
        </TouchableOpacity>
      );
    } else if (props.pokeBag) {
      return (
        <TouchableOpacity onPress={() => props.rightAction()}>
          <Text style={{color: COLORS.white, fontFamily: FONTS.title}}>
            PokeBag
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View
      style={{
        paddingVertical: 15,
        paddingHorizontal: 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: COLORS.theme,
      }}>
      {renderLeftHead()}
      {renderMidHead()}
      {renderRightHead()}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  buttonCatch: {
    width: 80,
    height: 35,
    backgroundColor: COLORS.orange,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  DissablebuttonCatch: {
    width: 80,
    height: 35,
    backgroundColor: COLORS.grayContact,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
