import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/appointments';

export const addAppointmentFollowUps = async (id,obj) => {
    let config = {
        headers:{
            'Content-type':"application/json",
            "Access-control-Allow-Origin":"*"
        }
    }
  return await axios.put(`${serverUrl}-floow-up/${id}` ,obj, config);
};

