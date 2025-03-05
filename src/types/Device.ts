type Device = {
    token: string,
    type: "ios" | "android" | "windows" | "macos" | "web",
    device_agent?: string,
}

export default Device;