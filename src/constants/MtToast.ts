import Toast from "react-native-toast-message";

const MtToast = {
    error: (error: string) => Toast.show({
        type: 'MtToastError',
        text1: error,
        position: 'bottom'
    }),
    success: (success: string) => Toast.show({
        type: 'MtToastSuccess',
        text1: success,
        position: 'bottom'
    }),
}

export default MtToast;