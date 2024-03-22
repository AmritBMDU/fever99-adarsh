import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/file-upload';

// export const addServiceBooking = async (obj) => {
//     let config = {
//         headers:{
//             'Content-type':"application/json",
//             "Access-control-Allow-Origin":"*"
//         }
//     }
//   return await axios.post(`${serverUrl}` ,obj, config);
// };


export const fileUpload = async (formdata) => {
    let config = {
        headers:{
            'accept':"application/json",
            'Content-type':"multipart/form-data",
            "Access-control-Allow-Origin":"*"
        }
    }
  return await axios.post(`${serverUrl}`, formdata , config);
};
