import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './src/contexts/UserContext';
import Login from './src/screens/Login';
import Meals from './src/screens/Meals';
import './global.css';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Meals"
            component={Meals}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>

      </NavigationContainer>
    </UserProvider>
  );
}
