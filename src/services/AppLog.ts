import { API } from "./API";
import Request from "./Request";


const createLog = async (activity: string, payload: {} = {}) => {
    console.log('creating log...');

    const data = new FormData();
    data.append('activity', activity);
    data.append('payload', JSON.stringify(payload));
    data.append('device_timestamp', new Date().toLocaleString());

    Request._postRequest(API.createAppLogs, data, (response, error) => {
        console.log({ response }, { error });
        if (error) { } else if (response) { }
    })
}

const LOG_ACTIVITIES = {
    PROFILE_UPDATE: 'Uploading profile pic',
    CHECKIN: 'User has checkedIn',
    OFFER_REDEEM: 'User has tried to redeem offer',
    VERIFY_CONTACT: 'User tried to verify contact',
}

export { createLog, LOG_ACTIVITIES };