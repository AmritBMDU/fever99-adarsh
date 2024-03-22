import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/appointments';

export const addAppointments = async (obj) => {
    let config = {
        headers:{
            'Content-type':"application/json",
            "Access-control-Allow-Origin":"*"
        }
    }
  let temp = await axios.post(`${serverUrl}`, obj ,  config);
    console.log(temp);
    return temp
  //   return await axios.post(`${serverUrl}`, obj ,  config);
};



export const updateAppointments = async (id,obj) => {
    let config = {
        headers:{
            'Content-type':"application/json",
            "Access-control-Allow-Origin":"*"
        }
    }
  return await axios.put(`${serverUrl}/${id}`,obj, config);
};

export const updateAppointmentCallStatus= async (id,obj) => {
    let config = {
        headers:{
            'Content-type':"application/json",
            "Access-control-Allow-Origin":"*"
        }
    }
  return await axios.put(`${serverUrl}-call-status/${id}`,obj, config);
};


export const getAppointments = async (query) => {
    let config = {
        headers:{
            'Content-type':"*",
            "Access-control-Allow-Origin":"*"
        }
    }
    console.log("this this is is sos oi skjdsnfdslkjf  ...............................//....................///./...../",query)
  return await axios.get(`${serverUrl}?${query}` , config);
};
export const getAppointmentById = async (id) => {
    let config = {
        headers:{
            'Content-type':"*",
            "Access-control-Allow-Origin":"*"
        }
    }
  return await axios.get(`${serverUrl}/${id}` , config);
};
