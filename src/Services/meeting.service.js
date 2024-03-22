import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/agora-token-generate';
export const getMeetingToken = async (query) => {
    return await axios.post(`${serverUrl}`, query);
};
