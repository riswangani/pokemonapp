import {
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Input from '../../components/Input';
import {COLORS} from './../../Styles/Color';
import {Formik} from 'formik';
import * as yup from 'yup';
import database from '@react-native-firebase/database';

const Login = ({navigation}) => {
  const handleOnSubmit = values => {
    console.log(values.email);
    try {
      database()
        .ref('users/')
        .orderByChild('emailId')
        .equalTo(values.email)
        .once('value')
        .then(async snapshot => {
          if (snapshot.val() == null) {
            Alert.alert('Error', 'Invalid Email Id');
            return false;
          }
          let userData = Object.values(snapshot.val())[0];
          if (userData?.password != values.password) {
            Alert.alert('Error', 'Invalid Password!');
            return false;
          }
          console.log('User data: ', userData);
          navigation.navigate('Dashboard', {userData: userData});
        });
    } catch (error) {
      Alert.alert('Error', 'Not Found User');
    }
  };

  const loginSchema = yup.object().shape({
    email: yup.string().email().required('Email is required'),
    password: yup
      .string()
      .required('Please Enter your password')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
      ),
  });

  return (
    <Formik
      initialValues={{email: '', password: ''}}
      onSubmit={handleOnSubmit}
      validationSchema={loginSchema}>
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.title}>Login</Text>
            <Input
              onChangeText={handleChange('email')}
              value={values.email}
              placeHolder={'Username'}
              error={errors.email}
            />
            <Input
              onChangeText={handleChange('password')}
              value={values.password}
              placeHolder={'Password'}
              error={errors.password}
            />
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.ButtonSubmit}>
              <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text> Register Here!!</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </Formik>
  );
};

export default Login;

const styles = StyleSheet.create({
  title: {
    marginVertical: 10,
  },
  ButtonSubmit: {
    backgroundColor: COLORS.theme,
    width: '90%',
    height: 50,
    borderRadius: 30,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
});
