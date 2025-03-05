import React, { useState } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import Dialog from 'react-native-dialog';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';

type ImagePickerDialogProps = {
    onCancel: () => void
    onImageSelect: (sources: Asset[]) => void
}

const ImagePickerDialog: React.FC<ImagePickerDialogProps> = (props) => {
    const { onCancel, onImageSelect } = props;

    const handleCamera = () => {
        launchCamera({ mediaType: 'photo' }, response => {
            if (!response.didCancel && !response.errorCode && response.assets) {
                onImageSelect(response.assets);

            } else if (response.errorCode) {
                Alert.alert('Camera Error', response.errorMessage);
            }
        });
    };

    const handleGallery = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (!response.didCancel && !response.errorCode && response.assets) {
                onImageSelect(response.assets);

            } else if (response.errorCode) {
                Alert.alert('Gallery Error', response.errorMessage);
            }
        });
    };

    return (
        <Dialog.Container visible={true}>
            <Dialog.Title>Select Image</Dialog.Title>
            <Dialog.Description>Choose an image from the camera or gallery</Dialog.Description>
            <Dialog.Button label="Camera" onPress={handleCamera} />
            <Dialog.Button label="Gallery" onPress={handleGallery} />
            <Dialog.Button label="Cancel" onPress={onCancel} />
        </Dialog.Container>
    );
};

export default ImagePickerDialog;
