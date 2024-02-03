// src/screens/Auth/SignInScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [councilPerson, setCouncilPerson] = useState(null);

  const handleSignIn = async () => {
    try {
      // If the credentials are correct:
      await AsyncStorage.setItem('userToken', 'dummy-token');
      // Navigate to the HomeScreen
      navigation.replace('Home');
    } catch (err) {
      // If there's an error, handle it (e.g., incorrect credentials, network issues)
      Alert.alert('Sign-in failed', 'Please check your credentials and try again.');
    }
  };

  const handleLookupCouncilPerson = async () => {
    // Placeholder logic for council person lookup
    // You'd replace this with your API call to get council person data
    if (zipCode.trim() === '') {
      Alert.alert('Input required', 'Please enter a ZIP code to look up your council person.');
      return;
    }

    // Simulate an API call
    setTimeout(() => {
      // Simulate finding a council person and updating state
      setCouncilPerson({
        name: 'Jane Doe',
        district: 'District 1',
        phone: '555-1234',
      });
      Alert.alert('Council Person Found', `Name: Jane Doe\nDistrict: District 1\nPhone: 555-1234`);
      // Clear the ZIP code input
      setZipCode('');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Council Person Lookup Section */}
      <Text style={styles.header}>Lookup Your NYC Council Person</Text>
      <TextInput
        value={zipCode}
        onChangeText={setZipCode}
        placeholder="Enter ZIP code"
        style={styles.input}
        keyboardType="number-pad"
      />
      <Button title="Look Up" onPress={handleLookupCouncilPerson} />
      
      {/* Optional: Display Council Person Information */}
      {councilPerson && (
        <View style={styles.councilInfo}>
          <Text style={styles.infoText}>Name: {councilPerson.name}</Text>
          <Text style={styles.infoText}>District: {councilPerson.district}</Text>
          <Text style={styles.infoText}>Phone: {councilPerson.phone}</Text>
        </View>
      )}

      <Text style={styles.divider}>OR</Text>
      
      {/* Sign In Section */}
      <Text style={styles.header}>Sign In</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ff3414',
    borderRadius: 5,
  },
  divider: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 20,
  },
  councilInfo: {
    padding: 10,
    marginVertical: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default SignInScreen;
