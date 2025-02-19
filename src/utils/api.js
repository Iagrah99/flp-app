import axios from 'axios';

const weeklyMealsApi = axios.create({
  baseURL: 'https://weekly-meals-be.fly.dev/api',
});

export const getUsers = async () => {
  const res = await weeklyMealsApi.get('/users');
  return res.data.users;
};

export const loginUser = async (username, password) => {
  const res = await weeklyMealsApi.post('/auth/login', {
    user: { username, password },
  });
  return res.data;
};
