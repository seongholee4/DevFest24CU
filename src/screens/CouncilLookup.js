// src/screens/Auth/CouncilLookup.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CouncilLookup = () => {
  const [zipCode, setZipCode] = useState('');

  const handleLookup = async () => {
    // Placeholder function where you'd implement the lookup logic
    // This might involve calling an API with the zipCode and then displaying the results
    console.log('Lookup council person for ZIP code:', zipCode);
    // You would set the council person information in state and display it below
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Not sure who your NYC council person is? Enter your ZIP code below to find out.
      </Text>
      <TextInput
        value={zipCode}
        onChangeText={setZipCode}
        placeholder="Enter ZIP code"
        keyboardType="number-pad"
        style={styles.input}
      />
      <Button title="Look Up" onPress={handleLookup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});

export default CouncilLookup;
