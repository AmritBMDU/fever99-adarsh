import axios from 'axios';
import { AUTH_TOKEN } from '../utils/constant';
import { deleteJwt, getJwt } from './user.service';
export const axiosAuth = axios.create();

axiosAuth.interceptors.request.use(
  async function (config) {
    const token = await getJwt()
    if (typeof token != 'undefined' && token !== null) {
      config.headers['Authorization'] = `${token}`
    }
    // console.log(JSON.stringify(config, null, 2), "config")
    return config;

  },
  async function (error) {
    if (error.response.status === 401) {
      // trigger logout or refresh token
      // localStorage.removeItem(AUTH_TOKEN)
      await deleteJwt()
      // window.location.href = '/'
    }
    return Promise.reject(error);
  },
);

axiosAuth.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (error.response && error.response.status === 401) {
      // trigger logout  or refresh token
      // console.error("LOGOUT", error.response)
      // localStorage.removeItem(AUTH_TOKEN)
      await deleteJwt()
      // window.location.href = '/'
    }
    return Promise.reject(error);
  },
);

export default axiosAuth;