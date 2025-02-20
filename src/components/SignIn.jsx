import { TouchableOpacity, Text } from 'react-native';
import React from 'react';

const SignIn = ({ pressHandler }) => {
  return (
    <TouchableOpacity onPress={pressHandler} className="w-1/3 m-auto my-5 py-3 rounded-md shadow-md bg-indigo-700">
      <Text className="text-white text-center text-sm font-medium">
        Sign in
      </Text>
    </TouchableOpacity>
  );
};

export default SignIn;
