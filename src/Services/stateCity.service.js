import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/state-city';

export const getstateAndCities = async () => {
    let config = {
        headers:{
            'Content-type':"application/json",
            "Access-control-Allow-Origin":"*"
        }
    }
  return await axios.get(`${serverUrl}`, config);
};