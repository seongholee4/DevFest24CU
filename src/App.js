// App.js or your main entry file
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'expo-splash-screen';
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import CouncilLookup from './screens/CouncilLookup';
const Stack = createNativeStackNavigator();

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Initially prevent the splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();
        
        // Check the sign-in status
        const token = await AsyncStorage.getItem('userToken');
        setIsSignedIn(!!token);
      } catch (e) {
        console.error("Failed to check the user's sign-in status", e);
        setIsSignedIn(false);
      } finally {
        // Hide the splash screen after checking the sign-in status
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  if (isSignedIn === null) {
    return null; // You could return a loading indicator here instead
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          // User is signed in, show home screen
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          // User is not signed in, show sign-in screen
          <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
