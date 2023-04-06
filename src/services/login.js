import axios from 'axios';

const baseURL = ' http://localhost:3050/api/v1/';

const login = async (credentials) => {
  const response = await axios.post(`${baseURL}auth/login`, credentials);
  return response.data;
};

export default login;
