// /

import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/notifyMeetingUsers';

export const SendNotification = async (obj) => {
    let config = {
        headers: {
            'Content-type': "application/json",
            "Access-control-Allow-Origin": "*"
        }
    }
    return await axios.post(`${serverUrl}`, obj, config);
};



export const SendNotificationForMeetingCreation = async (obj) => {
    let config = {
        headers: {
            'Content-type': "application/json",
            "Access-control-Allow-Origin": "*"
        }
    }
    return await axios.post(`${url}/notifyUsersForMeetingCreation`, obj, config);
};