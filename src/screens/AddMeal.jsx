import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, TextInput, ScrollView, TouchableOpacity, View, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { addMeal } from '../utils/api';
import config from '../../config';
import { format } from 'date-fns';

const AddMeal = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [rating, setRating] = useState(1);
  const [lastEaten, setLastEaten] = useState(new Date());
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [ingredientsStr, setIngredientsStr] = useState('');

  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Request permissions for image picker
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera roll permissions are needed to upload images.');
      }
    };
    requestPermissions();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setLastEaten(selectedDate);
    }
  };

  const handleImageUpload = async (imageUri) => {
    setIsImageUploading(true);
    const apiKey = config.IMGBB_API_KEY

    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.data.url);
        setIsImageUploading(false);
      } else {
        console.error('Image upload failed:', data);
        setImageUrl('');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsImageUploading(false);
      setImageUrl('');
    }
  };

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await handleImageUpload(uri);
    }
  };

  const handleAddMeal = async () => {
    if (!name.trim() || !source.trim()) {
      return Alert.alert('Missing Fields', 'Please fill in all fields.');
    }

    setIsLoading(true);
    setIsError(false);

    const userToken = await AsyncStorage.getItem('token');
    const loggedInUser = await AsyncStorage.getItem('loggedInUser');
    const username = loggedInUser ? JSON.parse(loggedInUser).username : 'Unknown';

    console.log(username);

    const meal = {
      name: name.trim(),
      source: source.trim(),
      ingredients: ingredientsStr.split(','),
      rating,
      last_eaten: format(lastEaten, 'yyyy/MM/dd'),
      image: imageUrl || 'https://i.ibb.co/8g34HY13/Default-Meal.png',
      created_by: username,
    };

    try {
      await addMeal({ meal }, userToken);
      Alert.alert('Success', 'Meal added successfully.');
      navigation.goBack();
    } catch (err) {
      console.error('Error adding meal:', err);
      setIsError(true);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView className="m-3">
            {/* Meal Name */}
            <Text className="text-base font-medium mb-2">Meal Name</Text>
            <TextInput
              className="h-12 border border-gray-300 rounded-lg px-3 mb-4 text-lg"
              value={name}
              onChangeText={setName}
              placeholder="Enter meal name"
            />

            {/* Source */}
            <Text className="text-base font-medium mb-2">Source</Text>
            <TextInput
              className="h-12 border border-gray-300 rounded-lg px-3 mb-4 text-lg"
              value={source}
              onChangeText={setSource}
              placeholder="Where is this meal from?"
            />

            {/* Last Eaten */}
            <Text className="text-base font-medium mb-2">Last Eaten</Text>
            <DateTimePicker
              value={lastEaten}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />

            {/* Rating */}
            <Text className="text-base font-medium mb-2 mt-4">Rating</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="bg-gray-300 px-3 py-2 rounded"
                onPress={() => setRating((prev) => Math.max(1, prev - 0.5))}
              >
                <Text>-</Text>
              </TouchableOpacity>
              <Text className="mx-4 text-lg">{rating}</Text>
              <TouchableOpacity
                className="bg-gray-300 px-3 py-2 rounded"
                onPress={() => setRating((prev) => Math.min(5, prev + 0.5))}
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>

            {/* Upload Image */}
            <Text className="text-base font-medium mb-2 mt-4">Upload Image</Text>
            <TouchableOpacity className="border border-gray-300 rounded-lg p-3 mb-4 bg-gray-100" onPress={handleChooseImage}>
              <Text className="text-gray-500">{image ? image.split('/').pop() : 'Choose File'}</Text>
            </TouchableOpacity>

            {/* Error Message */}
            {isError && <Text className="text-red-500">{error}</Text>}

            {/* Add Meal Button */}
            <TouchableOpacity
              className={`bg-blue-500 rounded-lg p-3 mt-5 shadow-lg flex items-center justify-center ${isLoading || isImageUploading ? 'opacity-50' : ''
                }`}
              onPress={handleAddMeal}
              disabled={isLoading || isImageUploading}
            >
              {isLoading || isImageUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white text-lg font-semibold">Add Meal</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AddMeal;
