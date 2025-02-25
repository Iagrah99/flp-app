import { SafeAreaView, ScrollView, StatusBar, Text, RefreshControl, Image, View, ActivityIndicator } from 'react-native'
import { Pencil, Trash, Star } from 'lucide-react-native';
import { getUserMeals } from '../utils/api'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { format } from 'date-fns';

const Meals = () => {

  const [meals, setMeals] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchMeals = async () => {
    const userToken = await AsyncStorage.getItem('token')
    const userId = JSON.parse(await AsyncStorage.getItem('loggedInUser')).user_id
    const userMeals = await getUserMeals(userId, userToken)
    setMeals(userMeals)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchMeals()
  }, [])

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="w-full p-4" refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => fetchMeals()} />}>
        {meals.map(meal => (
          <View key={meal.meal_id} className="bg-white shadow-md shadow-black/20 rounded-2xl p-4 mb-4 flex-row items-center">

            {/* Meal Image */}
            <Image
              source={{ uri: meal.image }}
              className="w-24 h-24 rounded-xl"
            />

            {/* Meal Details */}
            <View className="flex-1 ml-4">
              <Text className="text-lg font-semibold text-gray-900">{meal.name}</Text>
              <Text className="text-sm text-gray-500">{meal.source}</Text>
              <Text className="text-xs text-gray-400">{format(new Date(meal.last_eaten), 'EEEE, dd/MM/yyyy')}</Text>

              {/* Rating */}
              <View className="flex-row mt-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={index < meal.rating ? "text-yellow-500" : "text-gray-300"}
                    size={16}
                    fill={index < meal.rating ? "yellow" : "none"}
                  />
                ))}
              </View>
            </View>

            {/* Edit & Delete Buttons */}
            {/* <View className="flex-row space-x-3">
              <TouchableOpacity className="p-2 bg-blue-500 rounded-full">
                <Pencil size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="p-2 bg-red-500 rounded-full">
                <Trash size={20} color="white" />
              </TouchableOpacity>
            </View> */}

          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Meals