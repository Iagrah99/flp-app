import { SafeAreaView, View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { getMealById, deleteMealById } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { FontAwesome } from '@expo/vector-icons';
import config from '../../config';

const MealById = () => {
  const [meal, setMeal] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true); // Track Image Load
  const navigation = useNavigation();
  const route = useRoute();
  const { mealId: paramMealId, updatedMeal } = route.params || {};
  const mealId = paramMealId || meal?.meal_id; // Ensure mealId is always defined


  const [compressedImage, setCompressedImage] = useState(null);

  useEffect(() => {
    fetchMeal();
  }, []); // Run once when the component mounts

  useFocusEffect(
    useCallback(() => {
      if (route.params?.updatedMeal) {
        console.log("Updating meal with new data...");
        setMeal(route.params.updatedMeal); // Update text fields instantly

        // Force the image to reload by appending a query param to the URL
        setMeal((prevMeal) => ({
          ...prevMeal,
          image: `${route.params.updatedMeal.image}?timestamp=${new Date().getTime()}`
        }));
      } else {
        fetchMeal(); // Fetch from API if no updatedMeal is available
      }
    }, [route.params?.updatedMeal])
  );


  const fetchMeal = async () => {
    setIsLoading(true);
    try {
      const userToken = await AsyncStorage.getItem('token');
      const mealData = await getMealById(mealId, userToken);
      setMeal(mealData.meal);
    } catch (err) {
      console.error('Error fetching meal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // const compressImageWithTinyPNG = async (imageUri) => {
  //   // const apiKey = "nZDsMvwdFzJYQhbR0lKm6LPVQZgR759x"; // Your TinyPNG API Key
  //   const apiUrl = `https://api.tinify.com/shrink`;

  //   const apiKey = config.TINYPNG_API_KEY;

  //   try {

  //     if (imageUri.includes("tinify")) {
  //       console.log("Image is already compressed. Skipping compression.");
  //       return;
  //     }

  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         "Authorization": "Basic " + btoa(`api:${apiKey}`),
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ source: { url: imageUri } }),
  //     });

  //     const data = await response.json();

  //     if (data.output && data.output.url) {
  //       setCompressedImage(data.output.url);
  //     }
  //   } catch (error) {
  //     console.error("Error compressing image:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (meal.image) {
  //     compressImageWithTinyPNG(meal.image);
  //   }
  // }, [meal.image]);

  const handleDeleteMeal = async () => {
    try {
      const userToken = await AsyncStorage.getItem('token');
      await deleteMealById(mealId, userToken);
      Alert.alert('Success', 'Meal deleted successfully');
      navigation.goBack();
    } catch (err) {
      console.error('Error deleting meal:', err);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-4">
        {/* Meal Image with Loading Indicator */}
        <View className="relative">
          {imageLoading && (
            <View className="absolute w-full h-56 justify-center items-center bg-gray-200">
              <ActivityIndicator size="large" color="#6366f1" />
            </View>
          )}
          <Image
            source={{ uri: compressedImage || meal.image }}
            className="w-full h-56 rounded-2xl shadow-lg"
            onLoadEnd={() => setImageLoading(false)} // Remove spinner when image loads
            onError={() => setImageLoading(false)} // Hide spinner if image fails to load
          />
        </View>

        {/* Meal Info */}
        <View className="p-4 bg-white rounded-2xl shadow-md mt-4">
          <Text className="text-2xl font-semibold text-gray-900">{meal.name}</Text>
          <Text className="text-sm text-gray-500 mt-1">Source: {meal.source}</Text>
          <Text className="text-xs text-gray-400 mt-1">
            Last Eaten: {meal.last_eaten ? format(new Date(meal.last_eaten), 'EEEE, dd/MM/yyyy') : 'No date available'}
          </Text>

          {/* Rating */}
          <View className="flex-row mt-2">
            {Array.from({ length: 5 }).map((_, index) => {
              const fullStars = Math.floor(meal.rating);
              const hasHalfStar = meal.rating % 1 !== 0 && index === fullStars;

              return (
                <FontAwesome
                  key={index}
                  name={index < fullStars ? "star" : hasHalfStar ? "star-half-full" : "star-o"}
                  size={18}
                  color={index < fullStars || hasHalfStar ? "#FFD700" : "#D3D3D3"} // Gold for full/half, Gray for empty
                  style={{ marginRight: 2 }}
                />
              );
            })}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-lg flex-1 mr-2 items-center"
            onPress={() => navigation.navigate('EditMeal', { meal })}
          >
            <FontAwesome name="pencil" size={16} color="white" />
            <Text className="text-white text-sm mt-1">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 p-3 rounded-lg flex-1 ml-2 items-center"
            onPress={() =>
              Alert.alert("Confirm Deletion", "Are you sure you want to delete this meal?", [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: handleDeleteMeal, style: "destructive" }
              ])
            }
          >
            <FontAwesome name="trash" size={16} color="white" />
            <Text className="text-white text-sm mt-1">Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MealById;
