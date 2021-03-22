import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gorestaurant-ignite.herokuapp.com/',
});

export default api;
