import { SafeAreaView, Text, View, Alert, StatusBar } from 'react-native'
import { useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../contexts/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FormButton from '../components/FormButton'

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
    <SafeAreaView className="flex-1 items-center justify-around bg-slate-900">
      <StatusBar barStyle="light-content" />
      <Text className="text-3xl pt-10 text-white">Welcome {loggedInUser.username}</Text>

      <View className="flex-1 justify-center w-full">
        <FormButton buttonColour="bg-green-500" buttonText="View Meals" pressHandler={() => Alert.alert("My Meals")} />
        <FormButton buttonColour="bg-blue-500" buttonText="Settings" pressHandler={() => Alert.alert("My Settings")} />
      </View>
      <FormButton buttonColour="bg-red-500" buttonText="Logout" pressHandler={confirmLogout} />
    </SafeAreaView>
  )
}

export default Welcome