import { Dimensions, Linking, Platform } from "react-native";

const Utils = {
  isEmpty: (value: any) => {
    return value === null || value === undefined || value === '';
  },
  anyEmpty: (value: Array<any>) => {
    return value.some(v => Utils.isEmpty(v))
  },
  isEmail: (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  },
  isPassword: (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  },
  isName: (name: string) => {
    const nameRegex = /^[a-zA-Z]{2,}$/;
    return nameRegex.test(name);
  },
  isPhone: (phone: string) => {
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phone);
  },
  isAddress: (address: string) => {
    const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
    return addressRegex.test(address);
  },
  isNumber: (num: string) => {
    const numRegex = /^\d+$/;
    return numRegex.test(num);
  },
  isDate: (date: string) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
  },
  isTime: (time: string) => {
    const timeRegex = /^\d{2}:\d{2}$/;
    return timeRegex.test(time);
  },
  isDateTime: (dateTime: string) => {
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    return dateTimeRegex.test(dateTime);
  },
  isURL: (url: string) => {
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  },
  isImage: (image: string) => {
    const imageRegex = /\.(jpg|jpeg|png|gif)$/;
    return imageRegex.test(image);
  },
  isVideo: (video: string) => {
    const videoRegex = /\.(mp4|avi|flv|wmv)$/;
    return videoRegex.test(video);
  },
  isAudio: (audio: string) => {
    const audioRegex = /\.(mp3|wav|ogg)$/;
    return audioRegex.test(audio);
  },
  isDocument: (document: string) => {
    const documentRegex = /\.(doc|docx|pdf|txt)$/;
    return documentRegex.test(document);
  },
  isFile: (file: string) => {
    const fileRegex =
      /\.(doc|docx|pdf|txt|jpg|jpeg|png|gif|mp4|avi|flv|wmv|mp3|wav|ogg)$/;
    return fileRegex.test(file);
  },
  convertToUrlParams: (obj: any) => {
    const params = new URLSearchParams();

    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach(value => params.append(key, value));
      } else {
        params.append(key, obj[key]);
      }
    }

    return params.toString();
  },

  convertTo12HourFormat(time24: string): string {
    // Split the input string into hours and minutes
    const [hours24, minutes] = time24.split(':').map(Number);

    // Calculate 12-hour format hours
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12; // Convert 0 to 12 for 12 AM

    // Return the formatted string
    return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  },
  openPhoneSetting() {
      //var packagee = DeviceInfo.getBundleId();
      if (Platform.OS === 'ios') {
          Linking.openURL('app-settings:')
      } else {
          Linking.openSettings();
          /* IntentLauncher.startActivity({
              action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
              data: 'package:' + packagee
          }) */
      }
  },
  generateUniqueString(length: number = 16): string {
    return [...Array(length)]
      .map(() => Math.random().toString(36).charAt(2))
      .join('');
  },
  rwdSize(size: number): number {
    const { width, height } = Dimensions.get('window');
    // Calculate responsive sizes
    const scale = width / 375; // Using 375 as base width
    return Math.round(scale * size);
  }

};

export default Utils;
