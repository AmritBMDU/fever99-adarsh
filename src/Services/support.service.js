import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/raise-complaints';

export const getsupport = async () => {
    let config = {
        headers:{
            'Content-type':"application/json",
            "Access-control-Allow-Origin":"*"
        }
    }
  return await axios.get(`${serverUrl}`, config);
};
export const addSupportComplaint = async (obj) => {
    let config = {
        headers:{
            'Content-type':"application/json",
            "Access-control-Allow-Origin":"*"
        }
    }
  return await axios.post(`${serverUrl}`,obj, config);
};