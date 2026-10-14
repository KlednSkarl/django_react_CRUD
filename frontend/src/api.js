import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/items/';
export const getItems = () => axios.get(API_BASE_URL);
export const createItem = (itemData) => axios.post(API_BASE_URL, itemData);
export const updateItem = (id, itemData) => axios.put(`${API_BASE_URL}${id}/`, itemData);
export const deleteItem = (id) => axios.delete(`${API_BASE_URL}${id}/`);

