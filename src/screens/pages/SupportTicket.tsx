import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    StyleSheet,
} from "react-native";
import PageHeader from "../../navigations/PageHeader";
import Loader from "../../components/Loader";
import ScreenProps from "../../types/ScreenProps";
import RootStackParamList from "../../types/RootStackParamList";
import Icon from "@react-native-vector-icons/fontawesome6";
import { Colors } from "../../constants/Colors";
import MtToast from "../../constants/MtToast";
import Request from "../../services/Request";
import SupportRequest, { SupportReply } from "../../types/SupportRequest";
import { isIos } from "../../constants/IsPlatform";
import { Fonts } from "../../constants/Fonts";


const SupportTicket: React.FC<ScreenProps<'SupportTicket'>> = (props) => {
    const { route } = props;

    const [messages, setMessages] = useState<SupportReply[]>([]);
    const ticket_id = route?.params ? route.params['ticket_id'] : undefined;

    const [message, setMessage] = useState<string>("");
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);
    const [ticket, setTicket] = useState<SupportRequest>();

    useEffect(() => {
        loadChat();
    }, [])

    // load thread chat
    const loadChat = () => {
        if (!ticket_id) {
            return MtToast.error('No Support Ticket found!');
        }

        setLoader(true)

        Request.supportReplies({ ticket_id }, (success, error) => {
            console.log(success, error, ticket_id)
            setLoader(false)
            setRefreshing(false)

            if (success) {
                setTicket(success.data)

                if (success.data?.replies?.length) {
                    setMessages(success.data?.replies)
                }
            }

            if (error) {
                MtToast.error(error.message)
            }
        })
    }

    const createReply = () => {
        if (!ticket_id) {
            return MtToast.error('No Support Ticket found!');
        }

        const body = {
            support_id: ticket_id,
            content: message
        }

        setLoader(true)
        Request.createSupportTicketReply(body, (success, error) => {
            setLoader(false)

            if (success) {
                MtToast.success(success.message);
            } else {
                MtToast.error(error.message);
            }
        })
    }

    // Function to refresh messages
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        loadChat();
    }, []);

    // Function to send message
    const sendMessage = () => {
        if (message.trim().length > 0) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { content: message, sender: "user" },
            ]);
            setMessage("");
        }

        createReply();
    };

    // Render each message bubble
    const renderMessage = ({ item }: { item: SupportReply }) => (
        <View style={[styles.messageContainer, item.sender === "user" ? styles.userMessage : styles.adminMessage]}>
            <Text style={styles.messageText}>{item.content}</Text>
        </View>
    );

    return (
        <View style={styles.container}>

            <Loader isLoading={loader} />

            <PageHeader
                showBackButton={true}
                title={ticket ? ticket.title : "Support Ticket"}
                {...props}
            >
                <TouchableOpacity activeOpacity={0.9} onPress={() => { onRefresh() }} style={{
                    padding: 10
                }}>
                    <Icon name='arrow-rotate-left' iconStyle="solid" size={20} color={Colors.grey} />
                </TouchableOpacity>
            </PageHeader>
            
            {/* Chat Messages */}
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderMessage}
                inverted
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />

            {/* Message Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    placeholderTextColor={Colors.grey}
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity activeOpacity={0.9} style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SupportTicket;

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    messageContainer: {
        padding: 12,
        marginVertical: 4,
        marginHorizontal: 10,
        borderRadius: 10,
        maxWidth: "80%"
    },
    userMessage: {
        alignSelf: "flex-end",
        backgroundColor: Colors.orange_shade1
    },
    adminMessage: {
        alignSelf: "flex-start",
        backgroundColor: Colors.white,
    },
    messageText: {
        color: Colors.black,
        fontSize: Fonts.fs_16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#FFF",
        borderTopWidth: 1,
        borderColor: "#CCC",
        paddingBottom: isIos ? 30 : 0
    },
    input: {
        color: Colors.black,
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 5,
        paddingHorizontal: 15,
        marginRight: 10
    },
    sendButton: {
        backgroundColor: Colors.primary_color_orange,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    sendText: {
        color: Colors.white,
        fontSize: Fonts.fs_16,
    },
});
