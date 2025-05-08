type SupportRequest = {
    id: number,
    user_id: number,
    title: string,
    description: string,
    replies?: Array<SupportReply>,
    status: number,
    created_at: string
}

export type SupportReply = {
    id?: number,
    support_id?: number,
    user_id?: number,
    user_type?: string,
    sender?: string;
    content: string,
    status?: number,
}

export default SupportRequest;