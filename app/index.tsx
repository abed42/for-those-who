import Svg, { Path } from "react-native-svg";

import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator, Keyboard } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import LoginPage from "@/components/Login";
import { Text } from "@/components/Themed";
import { KeyboardAvoidingView } from "react-native";

const Logo = () => {
  return (
    <Svg width="288" height="56" viewBox="0 0 288 56" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M77.3221 24.1072H73.261V36.3396H67.6894V24.1072H63.6533V19.0063H77.3221V24.1072ZM19.001 19.0064V36.3401H24.5476V30.7686H30.391V26.2863H24.5476V23.8845H31.109V19.0064H19.001ZM40.7954 30.0755C40.7954 28.8873 40.0034 28.0454 38.7648 28.0454C37.5517 28.0454 36.7588 28.8873 36.7588 30.0755C36.7588 31.2646 37.5517 32.1065 38.7648 32.1065C40.0034 32.1065 40.7954 31.2646 40.7954 30.0755ZM45.6982 30.0751C45.6982 33.9633 42.7022 36.662 38.765 36.662C34.8528 36.662 31.8564 33.9633 31.8564 30.0751C31.8564 26.1629 34.8528 23.4888 38.765 23.4888C42.7022 23.4888 45.6982 26.1629 45.6982 30.0751ZM55.9754 28.6867V23.4868C54.5145 23.4868 53.0535 24.3287 52.2116 25.7647V23.7836H47.3086V36.3382H52.2116V31.8314C52.2116 30.2466 52.2611 28.0676 55.9754 28.6867ZM91.8824 36.3396V28.4897C91.8824 26.6575 91.0405 23.4882 87.2767 23.4882C85.6424 23.4882 84.5531 24.2062 83.8346 25.0726V19.0063H78.9316V36.3396H83.8346V30.0251C83.8346 29.0348 84.3048 28.2918 85.3946 28.2918C86.5088 28.2918 86.9799 29.0348 86.9799 30.0251V36.3396H91.8824ZM102.432 30.0755C102.432 28.8873 101.64 28.0454 100.401 28.0454C99.1879 28.0454 98.3955 28.8873 98.3955 30.0755C98.3955 31.2646 99.1879 32.1065 100.401 32.1065C101.64 32.1065 102.432 31.2646 102.432 30.0755ZM107.335 30.0751C107.335 33.9633 104.339 36.662 100.401 36.662C96.4895 36.662 93.4932 33.9633 93.4932 30.0751C93.4932 26.1629 96.4895 23.4888 100.401 23.4888C104.339 23.4888 107.335 26.1629 107.335 30.0751ZM113.752 36.66C117.441 36.66 119.844 35.249 119.844 32.3765C119.844 29.9502 117.937 29.0833 114.767 28.4143L114.585 28.3792L114.584 28.3789C113.667 28.2024 113.034 28.0806 113.034 27.523C113.034 27.0773 113.454 26.7804 114.148 26.7804C114.743 26.7804 115.213 27.0528 115.386 27.5724L119.224 26.6316C118.704 24.5021 116.277 23.4868 114.098 23.4868C110.904 23.4868 108.329 24.8738 108.329 27.6714C108.329 30.2715 110.038 31.0639 112.514 31.5845C112.742 31.6336 112.963 31.6755 113.172 31.7151C114.119 31.8945 114.816 32.0267 114.816 32.5744C114.816 32.9956 114.396 33.2924 113.653 33.2924C112.712 33.2924 112.316 32.7972 112.192 32.4255L107.958 33.7385C108.503 35.9674 111.326 36.66 113.752 36.66ZM129.378 28.862C129.13 27.7973 128.511 27.1782 127.347 27.1782C126.308 27.1782 125.639 27.8222 125.366 28.862H129.378ZM133.91 31.2883H125.392C125.739 32.3535 126.556 32.9726 127.892 32.9726C129.13 32.9726 129.899 32.403 130.221 31.9323L133.464 33.8639C132.498 35.3498 130.517 36.662 127.892 36.662C123.361 36.662 120.588 33.8145 120.588 30.0751C120.588 26.2868 123.41 23.4888 127.249 23.4888C131.161 23.4888 134.405 25.9895 133.91 31.2883ZM161.225 36.34L166.351 19.0063H160.383L158.18 28.2174L155.703 19.0063H151.815L149.34 28.2174L147.16 19.0063H141.168L146.293 36.34H151.271L153.772 27.1036L156.248 36.34H161.225ZM180.418 28.4897V36.3396H175.515V30.0251C175.515 29.0348 175.044 28.2918 173.929 28.2918C172.84 28.2918 172.369 29.0348 172.369 30.0251V36.3396H167.467V19.0063H172.369V25.0726C173.088 24.2062 174.177 23.4882 175.811 23.4882C179.576 23.4882 180.418 26.6575 180.418 28.4897ZM188.94 28.0454C190.178 28.0454 190.971 28.8873 190.971 30.0755C190.971 31.2646 190.178 32.1065 188.94 32.1065C187.726 32.1065 186.934 31.2646 186.934 30.0755C186.934 28.8873 187.726 28.0454 188.94 28.0454ZM188.94 36.662C192.877 36.662 195.873 33.9633 195.873 30.0751C195.873 26.1629 192.877 23.4888 188.94 23.4888C185.028 23.4888 182.031 26.1629 182.031 30.0751C182.031 33.9633 185.028 36.662 188.94 36.662Z"
        fill="white"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M268.999 36.6607H205.831V19.8618H211.011V31.4809H263.819V19.8618H268.999V36.6607Z"
        fill="white"
      />
    </Svg>
  );
};
const TabOneScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const height = useSharedValue<number>(400);

  const [keyboardStatus, setKeyboardStatus] = useState("");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("Keyboard Shown");
      if (!isLoading) {
        height.value = withSpring(280);
      }
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("Keyboard Hidden");
      if (!isLoading) {
        height.value = withSpring(400);
      }
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [isLoading, keyboardStatus]);

  const handleAnimation = () => {
    setIsLoading(true);
    Keyboard.dismiss();
    height.value = withSpring(1200);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Animated.View style={{ ...styles.box, height }}>
        <Logo />
        {isLoading && (
          <ActivityIndicator size={100} color="white" style={styles.loader} />
        )}
        {isLoading && <Text style={styles.loadingText}>Loading log in...</Text>}
      </Animated.View>
      <LoginPage
        handleAnimation={handleAnimation}
        setIsLoading={setIsLoading}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  box: {
    width: "100%",
    marginTop: -20,
    backgroundColor: "#0029FF",
    borderRadius: 40,
    marginVertical: 64,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "auto",
  },
  loader: {
    marginTop: 80,
  },
  loadingText: {
    color: "white",
    marginTop: 20,
  },
});

export default TabOneScreen;
