import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import Input from '../../components/Input';
import {COLORS} from './../../Styles/Color';
import {Formik} from 'formik';
import * as yup from 'yup';
import database from '@react-native-firebase/database';
import uuid from 'react-native-uuid';

const Register = ({navigation}) => {
  const handleOnSubmit = values => {
    console.log(values);
    if (values.name == '' || values.email == '' || values.password == '') {
      Alert.alert('Error', 'Harap isi Semua field');
      return false;
    }
    let data = {
      id: uuid.v4(),
      name: values.name,
      emailId: values.email,
      password: values.password,
    };
    try {
      database()
        .ref('/users/' + data.id)
        .set(data)
        .then(() => {
          Alert.alert('Success', 'Register Successfully!');
          navigation.navigate('Login');
        });
    } catch (error) {
      Alert.alert('Error', error);
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
      initialValues={{name: '', email: '', password: ''}}
      onSubmit={handleOnSubmit}
      validationSchema={loginSchema}>
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.title}>Register</Text>
            <Input
              onChangeText={handleChange('name')}
              value={values.name}
              placeHolder={'Name'}
            />
            <Input
              onChangeText={handleChange('email')}
              value={values.email}
              placeHolder={'Email'}
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
          </View>
        </SafeAreaView>
      )}
    </Formik>
  );
};

export default Register;

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
