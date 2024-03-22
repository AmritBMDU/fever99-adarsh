import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/service-order';

export const addServiceBooking = async (obj) => {
    let config = {
        headers: {
            'Content-type': "application/json",
            "Access-control-Allow-Origin": "*"
        }
    }
    return await axios.post(`${serverUrl}`, obj, config);
};


export const addServiceBookingHealthInsurance = async (obj) => {
    let config = {
        headers: {
            'Content-type': "application/json",
            "Access-control-Allow-Origin": "*"
        }
    }
    return await axios.post(`${url}/add-insurence-service'`, obj, config);
};


export const getServiceBookings = async () => {
    let config = {
        headers: {
            'Content-type': "application/json",
            "Access-control-Allow-Origin": "*"
        }
    }
    console.log("..................................................................calling")
    return await axios.get(`${serverUrl}`, config);
};
