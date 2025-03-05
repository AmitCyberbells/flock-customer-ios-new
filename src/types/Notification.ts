import User from "./User";

type Notification = {
    id: number,
    type: string,
    notifiable: User,
    data: NotificationData,
    read_at: string,
    created_at: string
}

type NotificationData = {
    title: string,
    description?: string,
    image: string,
}

export default Notification;