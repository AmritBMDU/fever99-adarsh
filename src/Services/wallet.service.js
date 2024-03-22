import axios from './axios.service';
import url from './url.service';

const serverUrl = url + '/get/Wallet';

export const getWallet = async () => {
    let config = {
        headers: {
            'Content-type': "application/json",
            "Access-control-Allow-Origin": "*"
        }
    }
    return await axios.get(`${serverUrl}`, config);
};

// export const addAmountToWallet = async (obj) => {
//     let config = {
//         headers: {
//             'Content-type': "application/json",
//             "Access-control-Allow-Origin": "*"
//         }
//     }
//     return await axios.post(`${url}/add/wallet`, obj, config);
// };

// export const create_stripe_payment_intent = async (obj) => {
//     let config = {
//         headers: {
//             'Content-type': "application/json",
//             "Access-control-Allow-Origin": "*"
//         }
//     }
//     return await axios.post(`${url}/stripe-setup-intent`, obj, config);
// };


// export const create_stripe_payment_session = async (obj) => {

//     let config = {
//         headers: {
//             'Content-type': "application/json",
//             "Access-control-Allow-Origin": "*"
//         }
//     }

//     return await axios.post(`${url}/stripe/session-id`, obj, config);
// };


// export const checkPaymentStatus = async (sessionId) => {
//     let config = {
//         headers: {
//             'Content-type': "application/json",
//             "Access-control-Allow-Origin": "*"
//         }
//     }
//     return await axios.get(`${url}/stripe/payment-status?sessionId=${sessionId}`, config);
// };

export const initiateWalletRecharge = async (obj) => {
    let config = {
        headers: {
            'Content-type': "application/json",
            "Access-control-Allow-Origin": "*"
        }
    }
    return await axios.post(`${url}/initiateWalletRecharge`, obj, config);
};