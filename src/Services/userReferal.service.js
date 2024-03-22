import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/expert/referal-used-user';

export const getReferalUsed = async () => {
    let config = {
        headers:{
            'Content-type':"application/json",
            "Access-control-Allow-Origin":"*"
        }
    }
  return await axios.get(`${serverUrl}`, config);
};