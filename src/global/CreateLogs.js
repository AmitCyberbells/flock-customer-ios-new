import ApiCall from '../util/Network';
import Server from '../util/Server';

const createLog = async (activity, payload = {}) => {
    console.log('creating log...');

    const data = new FormData();
    data.append('user_id', payload['user_id']);
    data.append('user_type', 'customer');
    data.append('activity', activity);
    data.append('payload', JSON.stringify(payload));
    data.append('device_timestamp', JSON.stringify(new Date()));

    ApiCall.postRequest(Server.createAppLogs, data, (response, error) => {
        console.log({ response }, { error });
        if (error) { } else if (response) { }
    })
}

export { createLog };