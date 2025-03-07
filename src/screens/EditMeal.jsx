import { useState } from 'react';
import { SafeAreaView, Text, TextInput, ScrollView, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; // Import FileSystem
import config from '../../config';
import { updateMeal } from '../utils/api';

const EditMeal = () => {
  const route = useRoute();
  const { meal } = route.params;
  const navigation = useNavigation();

  const [image, setImage] = useState(meal.image);
  const [name, setName] = useState(meal.name);
  const [source, setSource] = useState(meal.source);
  const [rating, setRating] = useState(String(meal.rating));
  const [lastEaten, setLastEaten] = useState(new Date(meal.last_eaten));
  const [imageUploading, setImageUploading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setLastEaten(selectedDate);
    }
  };

  const handleChooseImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false, // We will convert manually later
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      alert('No image selected');
    }
  };

  const handleImageUpload = async (imageUri) => {
    setImageUploading(true);
    const imgBBAPIKey = config.IMGBB_API_KEY;

    try {
      // Convert Image URI to Base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const formData = new FormData();
      formData.append("image", base64Image);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBAPIKey}`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      setImageUploading(false);

      if (data.success) {
        return data.data.url; // Return the uploaded image URL
      } else {
        console.log("ImgBB Error:", data);
        return null;
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      setImageUploading(false);
      return null;
    }
  };

  const handleUpdateMeal = async () => {
    try {
      console.log("Uploading image...");

      const imgUrl = !image.includes("ibb.co") ? await handleImageUpload(image) : null;
      console.log("Uploaded Image URL:", imgUrl);

      // Construct the updated meal object
      const updatedMeal = {
        name,
        image: imgUrl || meal.image, // Ensure we use the latest image URL if available
        source,
        rating: Number(rating),
        last_eaten: lastEaten.toISOString(),
      };

      console.log("Updated Meal:", updatedMeal);

      // Get the user token
      const userToken = await AsyncStorage.getItem('token');
      if (!userToken) {
        console.error("No user token found!");
        return;
      }

      // Call the API to update the meal and **wait** for it to complete
      const updatedMealData = await updateMeal(meal.meal_id, updatedMeal, userToken);

      console.log("Updated Meal Data:", updatedMealData);

      if (updatedMealData) {
        console.log("Meal successfully updated!");
        navigation.goBack(); // Go back only after a successful update
      } else {
        console.error("Meal update failed.");
      }
    } catch (error) {
      console.error("Error updating meal:", error);
    }
  };


  if (imageUploading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-5 bg-white">
      <ScrollView className='m-3'>
        <Text className="text-base font-medium mb-2">Name</Text>
        <TextInput
          className="h-12 border border-gray-300 rounded-lg px-3 pb-3 mb-4 text-lg"
          value={name}
          onChangeText={setName}
          placeholder="Meal Name"
        />

        <Text className="text-base font-medium mb-2">Upload Image</Text>
        <TouchableOpacity className="border border-gray-300 rounded-lg p-3 mb-4 bg-gray-100" onPress={handleChooseImage}>
          <Text className="text-gray-500">
            {image ? image.split("/").pop() : "Choose File"}
          </Text>
        </TouchableOpacity>

        <Text className="text-base font-medium mb-2">Source</Text>
        <TextInput
          className="h-12 border border-gray-300 rounded-lg px-3 pb-3 mb-4 text-lg"
          value={source}
          onChangeText={setSource}
          placeholder="Source"
        />

        <Text className="text-base font-medium mb-2">Rating</Text>
        <TextInput
          className="h-12 border border-gray-300 rounded-lg px-3 pb-3 mb-4 text-lg"
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
          placeholder="Rating (1-5)"
        />

        <Text className="text-base font-medium mb-2">Last Eaten</Text>
        <View className='right-2'>
          <DateTimePicker
            value={lastEaten}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        </View>

        <TouchableOpacity className="bg-blue-500 rounded-lg p-3 mt-5" onPress={handleUpdateMeal}>
          <Text className="text-white text-center text-lg font-semibold">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditMeal;
