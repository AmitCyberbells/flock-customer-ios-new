type AppLog = {
    user_id?: number|string,
    activity: string,
    payload: string,
    device_agent: string,
    device_timestamp: string,
}

export default AppLog;