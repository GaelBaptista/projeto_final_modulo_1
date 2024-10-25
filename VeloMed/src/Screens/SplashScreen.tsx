import React, { useEffect } from "react";
import { StyleSheet, Image, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Splash"
>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Intro");
    }, 5000);
  }, []);

  return (
    <View
      // colors={["#4294a6", "#329eb6", "#3dbad6", "#51cee8", "#95d2df"]}
      style={styles.container}
    >
      <Image
        source={require("../../assets/medLogo-inicial.png")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4294a6",
  },
  logo: {
    width: 150,
    height: 150,
  },
});

export default SplashScreen;
