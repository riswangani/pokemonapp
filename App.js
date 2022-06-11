import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from 'react-query';

import {COLORS} from './src/Styles/Color';
const Stack = createNativeStackNavigator();
import Login from './src/screens/Auth/Login';
import Register from './src/screens/Auth/Register';
import Dashboard from './src/screens/Home/Dashboard';
import PokemonBag from './src/screens/Home/PokemonBag';
import PokemonDetail from './src/screens/Home/PokemonDetail';

const queryClient = new QueryClient();

import CodePush from 'react-native-code-push';
const codePushOptions = {checkFrequency: CodePush.CheckFrequency.ON_APP_START};

const App = () => {
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <Stack.Navigator
          detachInactiveScreens={false}
          initialRouteName="Auth"
          screenOptions={{
            headerShown: false,
            cardStyle: {backgroundColor: COLORS.white},
          }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="PokeBag" component={PokemonBag} />
          <Stack.Screen name="PokemonDetail" component={PokemonDetail} />
        </Stack.Navigator>
      </QueryClientProvider>
    </NavigationContainer>
  );
};

export default CodePush(codePushOptions)(App);

const styles = StyleSheet.create({});
