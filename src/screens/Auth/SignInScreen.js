import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SignIn = ({ onSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    // Placeholder for sign-in logic; this should be replaced with actual authentication logic
    if (username === 'admin' && password === 'password') {
      Alert.alert('Success', 'You are now signed in!');
      if (onSignIn) onSignIn(); // If there's a callback provided, call it
    } else {
      Alert.alert('Failure', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign In</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: '#fff', // Add this for better input visibility
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007AFF', // iOS-style blue button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignIn;
