import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const fetchFarmers = () => API.get('/farmers');
export const fetchFarmerById = (id) => API.get(`/farmers/${id}`);
export const createFarmer = (newFarmer) => API.post('/farmers', newFarmer);

