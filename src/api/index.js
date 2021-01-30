import axios from './axios';
import qs from 'qs';
export const login = data => axios.post('/login', data);
export default {
  login
}

