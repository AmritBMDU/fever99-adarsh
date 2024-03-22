import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/dashbord';


export const getDashboard= async () => {
    let config = {
        headers:{
            'Content-type':"*",
            "Access-control-Allow-Origin":"*"
        }
    }
  return await axios.get(`${serverUrl}` , config);
};
