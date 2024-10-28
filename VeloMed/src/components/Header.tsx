import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function TopBar() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const savedUserProfile = await AsyncStorage.getItem("userProfile");
        if (savedUserProfile) {
          const parsedProfile = JSON.parse(savedUserProfile);
          setUsername(parsedProfile.name);
        }
      } catch (error) {
        console.error("Erro ao buscar o nome de usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userProfile");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <View style={styles.header}>
      <FontAwesome
        name="user-circle"
        size={28}
        color="#00C2FF"
        style={styles.icon}
      />
      {loading ? (
        <ActivityIndicator size="small" color="#00C2FF" />
      ) : (
        <Text style={styles.usernameText}>{username || "Usuário"}</Text>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1e293b",
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  icon: {
    marginRight: 10,
  },
  usernameText: {
    fontSize: 18,
    color: "#00C2FF",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  logoutButton: {
    padding: 5,
  },
});
