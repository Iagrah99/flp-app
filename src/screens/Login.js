import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={container} className="flex-1">
        <StatusBar />
        <ImageBackground
          source={{ uri: 'https://i.ibb.co/jDQXXK6/login-bg.png' }}
          resizeMode="cover"
          className="flex-1 justify-evenly"
        >
          {/* Dark overlay */}
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50" />

          <View>
            <Text className="text-indigo-500 text-center py-4 text-3xl font-bold">
              FoodLogPro
            </Text>
            <Text className="text-center text-md text-md text-white mb-8">
              Log in to continue tracking your meals.
            </Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView>
              <View>
                <Text className="pl-4 text-white text-lg font-bold">
                  Username
                </Text>
                <TextInput
                  placeholder="Enter your username"
                  className="h-12 border border-gray-300 rounded-lg px-4 m-4 bg-gray-100 text-gray-800 shadow-md"
                />
              </View>
              <View>
                <Text className="pl-4 text-white text-lg font-bold">
                  Password
                </Text>
                <TextInput
                  placeholder="Enter you password"
                  className="h-12 border border-gray-300 rounded-lg px-4 m-4 bg-gray-100 text-gray-800 shadow-md"
                  secureTextEntry={true}
                />
              </View>
              <TouchableOpacity className="w-1/3 m-auto my-5 py-3 rounded-md shadow-md bg-indigo-700">
                <Text className="text-white text-center text-sm font-medium">
                  Sign in
                </Text>
              </TouchableOpacity>
              <Text className="mt-6 text-center text-md text-white">
                Don't have an account?{'  '}
                <Text className="font-medium text-indigo-500">Sign up</Text>
              </Text>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

// Keep this line for Android devices
const container = {
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
};
