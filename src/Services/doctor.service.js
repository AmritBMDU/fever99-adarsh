import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/doctor';

// export const addServiceBooking = async (obj) => {
//     let config = {
//         headers:{
//             'Content-type':"application/json",
//             "Access-control-Allow-Origin":"*"
//         }
//     }
//   return await axios.post(`${serverUrl}` ,obj, config);
// };


export const getDoctors = async (query) => {
    let config = {
        headers: {
            'Content-type': "*",
            "Access-control-Allow-Origin": "*"
        }
    }
    return await axios.get(`${serverUrl}ForApp?${query}`, config);
};
