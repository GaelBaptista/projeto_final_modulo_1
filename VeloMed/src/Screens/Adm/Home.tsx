import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CommonActions,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootStackParamList } from "../../../types";
import { TopBar } from "../../components/Header";

export function Home() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("userProfile");
        if (savedUser) {
          setUserProfile(JSON.parse(savedUser));
        }
      } catch (error) {
        console.log("Erro ao carregar o perfil do usuário:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TopBar />
        <View>
          <View style={styles.header}>
            <Image
              source={require("../../../assets/medLogo.jpg")}
              style={styles.profileImage}
            />

            <Text style={styles.userName}>
              Olá, {userProfile ? userProfile.name : "Usuário"}
            </Text>
            <Text style={styles.userRole}>Gerencie seu Negócio!</Text>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => navigation.navigate("Usuarios")}
            >
              <Text style={styles.navigationButtonText}>Usuários</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => navigation.navigate("Estoque")}
            >
              <Text style={styles.navigationButtonText}>Estoque</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },
  header: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  userRole: {
    fontSize: 16,
    color: "#cbd5e1",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    color: "#00C2FF",
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#cbd5e1",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navigationButton: {
    flex: 1,
    backgroundColor: "#00C2FF",
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 10,
  },
  navigationButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
