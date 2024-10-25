import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CommonActions,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderComponent from "../../components/Header";
import { RootStackParamList } from "../../../types"; // Certifique-se de que o caminho está correto

export function Home() {
  const [userProfile, setUserProfile] = useState<any>(null); // Estado para o perfil do usuário
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Tipagem correta do navigation

  // Carregar o perfil do usuário a partir do AsyncStorage
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("userProfile");
        if (savedUser) {
          setUserProfile(JSON.parse(savedUser)); // Atualiza o estado com o perfil do usuário
        }
      } catch (error) {
        console.log("Erro ao carregar o perfil do usuário:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      <HeaderComponent />

      <SafeAreaView style={styles.container}>
        <View>
          {/* Header da tela de perfil */}
          <View style={styles.header}>
            <Image
              source={require("../../../assets/medLogo.jpg")} // Imagem do perfil
              style={styles.profileImage}
            />

            <Text style={styles.userName}>
              {/* Exibe o nome do usuário carregado do AsyncStorage */}
              Olá, {userProfile ? userProfile.name : "Usuário"}{" "}
              {/* Mostra o nome do usuário */}
            </Text>
          </View>

          {/* Seção dos dois botões lado a lado */}
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
