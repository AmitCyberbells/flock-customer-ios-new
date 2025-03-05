import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import FastImage, { FastImageProps, Source } from 'react-native-fast-image';
import Images from '../constants/Images';
import { useSelector } from 'react-redux';
import { StoreStates } from '../store/store';
import SkeletonView from './SkeletonView';
import { ImageSourcePropType, StyleProp, ImageStyle } from "react-native";

type ImageviewProps = {
  style?: StyleProp<ImageStyle>;
  imageStyle?: StyleProp<{ borderRadius?: number }>;
  onLoad?: () => void;
  imageType?: string;
  url?: ImageSourcePropType | string;
  resizeMode?: FastImageProps["resizeMode"];
  tintColor?: string;
};

const Imageview: React.FC<FastImageProps & ImageviewProps> = (props) => {
  const { style, url, imageType, tintColor, resizeMode, imageStyle } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const auth = useSelector((state: StoreStates) => state.auth);

  useEffect(() => {

  }, [])

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const getImage = () => {

    if (typeof url === 'number') {
      return Image.resolveAssetSource(url).uri;
    }

    if (typeof url === 'string') {
      return url; // remote URL
    }

    return '';
  };

  return (
    <View style={[fastStyle.container, style]}>
      <FastImage
        style={[fastStyle.image, imageStyle]}
        source={imageType === 'local' ? { uri: getImage() } : {
          uri: getImage(),
          headers: { Authorization: `Bearer ${auth.accessToken}` },
          priority: FastImage.priority.high,
        }}
        defaultSource={Images.placeholder} // Optional fallback if you want
        tintColor={tintColor}
        resizeMode={
          resizeMode === 'cover'
            ? FastImage.resizeMode.cover
            : FastImage.resizeMode.contain
        }
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />

      {(loading || error) && <SkeletonView />}
    </View>
  );
};

const fastStyle = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 8,
    resizeMode: 'contain',
  },
});

export default Imageview;
