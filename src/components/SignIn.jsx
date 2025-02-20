import { TouchableOpacity, Text, View } from 'react-native';
import React from 'react';

const SignIn = ({ pressHandler, buttonText }) => {
  return (
    <TouchableOpacity
      onPress={pressHandler}
      className="w-1/3 m-auto my-5 py-3 rounded-md shadow-md bg-indigo-700 flex justify-center items-center"
    >
      {typeof buttonText === 'string' ? (
        <Text className="text-white text-center text-sm font-medium">{buttonText}</Text>
      ) : (
        <View className="flex justify-center items-center">
          {buttonText}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SignIn;
