import axios from 'axios';

const API_URL = "http://localhost:3000/api"; // Cambiar si el backend tiene otro puerto

export const fetchProducts = async (page = 1, category = null, sort = null) => {
  let url = `${API_URL}/products`;
  if (category) url += `/category/${category}`;
  const params = { page, sort };
  const { data } = await axios.get(url, { params });
  return data;
};

export const fetchProductDetails = async (id) => {
  const { data } = await axios.get(`${API_URL}/products/${id}`);
  return data;
};
