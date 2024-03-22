import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/medicines';

// export const addServiceBooking = async (obj) => {
//     let config = {
//         headers:{
//             'Content-type':"application/json",
//             "Access-control-Allow-Origin":"*"
//         }
//     }
//   return await axios.post(`${serverUrl}` ,obj, config);
// };


export const getMedicines = async (query) => {
    let config = {
        headers: {
            'Content-type': "*",
            "Access-control-Allow-Origin": "*"
        }
    }
    return await axios.get(`${serverUrl}?${query}`, config);
};

export const addMedicine = async (obj) => {
    let config = {
        headers: {
            'Content-type': "application/json",
            "Access-control-Allow-Origin": "*"
        }
    }

    return await axios.post(`${serverUrl}`, obj, config);
};
