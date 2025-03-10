import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider, UserContext } from './src/contexts/UserContext';
import { useContext, useEffect, useState } from 'react';
import Login from './src/screens/Login';
import Welcome from './src/screens/Welcome';
import Meals from './src/screens/Meals';
import MealById from './src/screens/MealById';
import EditMeal from './src/screens/EditMeal';
import AddMeal from './src/screens/AddMeal';
import './global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';



function AppNavigator() {
  const Stack = createNativeStackNavigator();
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const user = await AsyncStorage.getItem('loggedInUser');
      if (user) {
        setLoggedInUser(JSON.parse(user));
      }
      setIsLoading(false);
    };
    checkLoggedInUser();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={loggedInUser ? 'Welcome' : 'Login'}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Meals'
          component={Meals}
        />
        <Stack.Screen
          name='MealById'
          component={MealById}
          options={{ title: 'Meal Details' }}
        />

        <Stack.Screen
          name='EditMeal'
          component={EditMeal}
          options={{ title: 'Update Meal' }}
        />

        <Stack.Screen
          name='AddMeal'
          component={AddMeal}
          options={{ title: 'Add Meal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}