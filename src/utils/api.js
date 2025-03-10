import axios from 'axios';

const weeklyMealsApi = axios.create({
  baseURL: 'https://weekly-meals-be.fly.dev/api',
});

export const loginUser = async (username, password) => {
  const res = await weeklyMealsApi.post('/auth/login', {
    user: { username, password },
  });
  return res.data;
};

export const getUserMeals = async (user_id, token) => {
  const res = await weeklyMealsApi.get(`/users/${user_id}/meals`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.meals;
};

export const getMealById = async (meal_id, token) => {
  const res = await weeklyMealsApi.get(`/meals/${meal_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteMealById = async (meal_id, token) => {
  const res = await weeklyMealsApi.delete(`/meals/${meal_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateMeal = async (meal_id, updatedMeal, token) => {
  const meal = updatedMeal;
  console.log(meal);

  const res = await weeklyMealsApi.patch(
    `/meals/${meal_id}`,
    { meal },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.meal;
};

export const addMeal = async (meal, token) => {
  console.log(meal);
  const res = await weeklyMealsApi.post(
    '/meals',
    meal, // Send meal data in the body
    { headers: { Authorization: `Bearer ${token}` } } // Correct place for headers
  );
  return res.data.meal;
};
