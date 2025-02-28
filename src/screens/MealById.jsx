import { SafeAreaView, View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getMealById, deleteMeal } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { FontAwesome } from '@expo/vector-icons';

const MealById = () => {
  const [meal, setMeal] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const route = useRoute();
  const { mealId } = route.params;

  const fetchMeal = async () => {
    setIsLoading(true);
    try {
      const userToken = await AsyncStorage.getItem('token');
      const mealData = await getMealById(mealId, userToken);
      setMeal(mealData.meal);
      console.log(mealData.meal.image);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching meal:', err);
    }
  };

  useEffect(() => {
    fetchMeal();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  const handleDelete = async () => {
    Alert.alert("Delete Meal", "Are you sure you want to delete this meal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const userToken = await AsyncStorage.getItem('token');
          await deleteMeal(mealId, userToken);
          navigation.goBack(); // Go back to the previous screen after deletion
        },
        style: "destructive"
      }
    ]);
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
        {/* Meal Image */}
        <Image source={{ uri: meal.image }} className="w-full h-56 rounded-2xl shadow-lg" cachePolicy="memory-disk" />

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
            onPress={() => navigation.navigate('EditMeal', { mealId })}
          >
            <FontAwesome name="pencil" size={16} color="white" />
            <Text className="text-white text-sm mt-1">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 p-3 rounded-lg flex-1 ml-2 items-center"
            onPress={handleDelete}
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
