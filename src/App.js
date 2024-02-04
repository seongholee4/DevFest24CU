import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './screens/Auth/SignInScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

const FirstPage = ({ navigation }) => {
  const [zipCode, setZipCode] = useState('');
  const [councilman, setCouncilman] = useState(null);

  const fetchCouncilMan = () => {
    const url = `/api/getMember`; 
    const data = { zipCode: zipCode };

    fetch(url, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        Alert.alert('No council member found for this ZIP code.');
      } else {
        setCouncilman(data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      Alert.alert('Error fetching council member information.');
    });
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Find Your Councilman</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter ZIP Code"
        value={zipCode}
        onChangeText={setZipCode}
        keyboardType="number-pad"
      />
      <TouchableOpacity style={styles.button} onPress={fetchCouncilMan}>
        <Text style={styles.buttonText}>Lookup</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        {councilman && (
          <View style={styles.councilmanDetails}>
            <Image source={{ uri: councilman.imageURL }} style={styles.councilmanImage} />
            <Text style={styles.detailText}>Name: {councilman.name}</Text>
            <Text style={styles.detailText}>District Number: {councilman.districtNum}</Text>
            <Text style={styles.detailText}>Party: {councilman.party}</Text>
            <Text style={styles.detailText}>Email: {councilman.email}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.authContainer}>
        <Text style={styles.orText}>Or...</Text>
        <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.authButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.authButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  authContainer: {
    marginTop: 30,
    backgroundColor: '#f0f0f0', // Light background to separate auth options
    borderRadius: 30,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd', // Radial border color effect
    shadowColor: '#ffb163', // For glowing effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10, // For Android shadow
  },
  orText: {
    fontSize: 18,
    marginVertical: 10,
  },
  authButton: {
    backgroundColor: '#ffdd00', // Yellow for glowing effect
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    // Glowing effect for buttons
    shadowColor: '#ffdd00', // Yellow glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  authButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default FirstPage;