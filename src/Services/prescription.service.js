import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/prescription';

export const getPrescriptionById = async (id) => {
    let config = {
        headers:{
            'Accept':"text/pdf",
            "Access-control-Allow-Origin":"*",
        },
        responseType:"blob",
    }
  return await axios.get(`${serverUrl}/${id}` , config);
};

export const addPrescription = async (formdata) => {
    let config = {
        headers:{
            "Access-control-Allow-Origin":"*"
        }
    }
  return await axios.post(`${serverUrl}s`, formdata , config);
};
export const editPrescription = async (id, formdata) => {
    let config = {
        headers:{
            "Access-control-Allow-Origin":"*"
        }
    }
  return await axios.put(`${serverUrl}s/${id}`, formdata , config);
};


export const getPrescriptionFileById = async (id, formdata) => {
    let config = {
        headers:{
            "Access-control-Allow-Origin":"*"
        }
    }
  return await axios.put(`${serverUrl}-by-id/${id}`, formdata , config);
};
