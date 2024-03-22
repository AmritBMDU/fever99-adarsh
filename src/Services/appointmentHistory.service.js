import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '';

export const addAppointmentHistory = async (id, obj) => {
    let config = {
        headers: {
            'Content-type': "application/json",
            "Access-control-Allow-Origin": "*"
        }
    }
    return await axios.put(`${serverUrl}/add-appointment-history/${id}`, obj, config);
};

export const addAppointmentFollowUps = async (id, obj) => {
    let config = {
        headers: {
            'Content-type': "application/json",
            "Access-control-Allow-Origin": "*"
        }
    }
    return await axios.put(`${serverUrl}/appointments-floow-up/${id}`, obj, config);
};








