import { SafeAreaView, Text, View, Alert, StatusBar, ImageBackground, Platform } from 'react-native'
import { useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../contexts/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FormButton from '../components/FormButton'
import WelcomeImage from '../../assets/welcome.png'

const Welcome = () => {
  const { loggedInUser } = useContext(UserContext)
  const navigation = useNavigation()

  const confirmLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Yes',
          onPress: handleLogout,
        },
        {
          text: 'No',
          style: 'cancel',
        },
      ],
    );
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedInUser');
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={container} className="flex-1">
      <StatusBar barStyle="dark-content" />

      <ImageBackground
        source={WelcomeImage}
        resizeMode="cover"
        className="flex-1 justify-evenly">

        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50" />

        <Text className="text-3xl pt-10 text-center text-white">Welcome {loggedInUser.username}</Text>

        <View className="flex-1 justify-center w-full">
          <FormButton buttonColour="bg-green-500" buttonText="View Meals" pressHandler={() => navigation.navigate("Meals")} />
          {/* <FormButton buttonColour="bg-blue-500" buttonText="Settings" pressHandler={() => Alert.alert("My Settings")} /> */}
        </View>
        <FormButton buttonColour="bg-red-500" buttonText="Logout" pressHandler={confirmLogout} />
      </ImageBackground>
    </SafeAreaView>
  )
}

const container = {
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
};

export default Welcome