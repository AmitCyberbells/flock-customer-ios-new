import React from "react";
//import LottieView from "lottie-react-native";
import { View, StyleSheet, Image } from "react-native";
import Images from "../constants/Images";
import Imageview from "./Imageview";

const Loader = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  return (
    <View style={styles.overlay}>
      {/* <LottieView
        source={require("../assets/loader.json")}
        autoPlay
        loop
        style={styles.animation}
      /> */}
      <Imageview
        style={{
          width: 200,
          height: 200
        }}
        imageType={'local'}
        url={Images.loader}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99
  },
  animation: {
    width: 200,
    height: 200,
  },
});

export default React.memo(Loader);
