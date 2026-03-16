import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const submitSupplyRequest = (data) => API.post('/supplies/request', data);
export const getSupplyHistory = () => API.get('/supplies');
