import axios from './axios.service';
// import axios from 'axios';
import url from './url.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN } from '../utils/constant';
import jwt_decode from "jwt-decode";
import { getJwt } from './user.service';

const serverUrl = url + '/services';

export const getServicesPaginated = async (query) => {
    let config = {
        headers: {
            'Content-type': "application/json",
            "Access-control-Allow-Origin": "*"
        }
    }
    return await axios.get(`${serverUrl}?${query}`, config);
};


export const getServiceByid = async (id) => {
    let config = {
        headers: {
            'Content-type': "application/json",
            "Access-control-Allow-Origin": "*"
        }
    }
    return await axios.get(`${serverUrl}/${id}`, config);
};
