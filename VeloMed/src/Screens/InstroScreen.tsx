import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
// import { LinearGradient } from "expo-linear-gradient";

type IntroScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Intro"
>;

interface Props {
  navigation: IntroScreenNavigationProp;
}

export function IntroScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/svg-intro.svg")}
        style={styles.image}
      />
      <Text style={styles.title}>Get connect our best Doctors</Text>
      <Text style={styles.subtitle}>
        Get an Expert Medical Opinion from one of our world-renowned
        specialists.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    color: "#fff",
  },
  subtitle: {
    textAlign: "center",
    paddingHorizontal: 30,
    marginTop: 15,
    fontSize: 14,
    color: "#fff",
  },
  // gradientButton: {},
  button: {
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    // borderRadius: 30,
    marginTop: 30,
    backgroundColor: "#329eb6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default IntroScreen;
