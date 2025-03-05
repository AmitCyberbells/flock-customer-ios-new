import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

type loaderProps = {
  isLoading: boolean
}

const AnimatedLoader: React.FC<loaderProps> = ({isLoading}) => {
  return (
    isLoading ? (
      <View style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
      }}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    ) : null
  );
}

export default React.memo(AnimatedLoader);