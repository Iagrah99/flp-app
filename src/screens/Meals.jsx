import { SafeAreaView, ScrollView, StatusBar, Text, RefreshControl, Image, View, ActivityIndicator } from 'react-native';
import { getUserMeals } from '../utils/api';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMeals = async () => {
    const userToken = await AsyncStorage.getItem('token');
    const userId = JSON.parse(await AsyncStorage.getItem('loggedInUser')).user_id;
    const userMeals = await getUserMeals(userId, userToken);
    setMeals(userMeals);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <ScrollView
        className="w-full p-4"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchMeals} />}
      >
        {meals.map(meal => (
          <View
            key={meal.meal_id}
            className="bg-white shadow-md shadow-black/20 rounded-2xl p-4 mb-4 flex-row items-center"
          >
            {/* Meal Image */}
            <Image source={{ uri: meal.image }} className="w-24 h-24 rounded-xl" />

            {/* Meal Details */}
            <View className="flex-1 ml-4">
              <Text className="text-lg font-semibold text-gray-900">{meal.name}</Text>
              <Text className="text-sm text-gray-500">{meal.source}</Text>
              <Text className="text-xs text-gray-400">{format(new Date(meal.last_eaten), 'EEEE, dd/MM/yyyy')}</Text>

              {/* Rating with Half-Star Support */}
              <View className="flex-row mt-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const fullStars = Math.floor(meal.rating);
                  const hasHalfStar = meal.rating % 1 !== 0 && index === fullStars;

                  return (
                    <FontAwesome
                      key={index}
                      name={index < fullStars ? "star" : hasHalfStar ? "star-half-full" : "star-o"}
                      size={16}
                      color={index < fullStars || hasHalfStar ? "#FFD700" : "#D3D3D3"} // Gold for full/half, Gray for empty
                      style={{ marginRight: 2 }}
                    />
                  );
                })}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Meals;
