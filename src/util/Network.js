import { NativeModules } from 'react-native';
import { Alert } from 'react-native';

export default class NetWork {
  static getRequest = (url, callback) => {
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        //'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => {
        callback(response, undefined);
      })
      .catch(error => {
        callback(undefined, error);
      });
  };

  static postRequest_v1 = (url, body, callback) => {
    //const boundary = '--------------------------' + Date.now();

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        //"Content-Type": `multipart/form-data; boundary=${boundary}`
      },
      body: body,
    })
      .then(response => response.json())
      .then(json => {

        callback(json, undefined);
      })
      .catch(error => {
        callback(undefined, error);
      });
  };

  static postRequest = async (url, body, callback) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          // Note: 'Content-Type' should not be set if body is a FormData object
          ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      console.log('api responseerrr:', response, json);
      
      callback(json, undefined);
    } catch (error) {
      callback(undefined, error);
    }
  };
}