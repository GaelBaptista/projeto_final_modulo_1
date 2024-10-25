import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("userProfile");
        if (savedUser) {
          const userProfile = JSON.parse(savedUser);

          if (userProfile.profile === "admin") {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
              })
            );
          } else if (userProfile.profile === "filial") {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "ListagemMovimentacao" }],
              })
            );
          } else {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "ListagemMovimentacao" }],
              })
            );
          }
        }
      } catch (error) {
        console.log("Erro ao verificar o status de login:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    console.log("Email:", email);
    console.log("Password:", password);

    axios
      .post(process.env.EXPO_PUBLIC_API_URL + "/login", { email, password })
      .then(async (response) => {
        const userProfile = response.data;

        console.log("API response:", userProfile);

        if (userProfile.profile === "admin") {
          await AsyncStorage.setItem(
            "userProfile",
            JSON.stringify(userProfile)
          );
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
            })
          );
        } else if (userProfile.profile === "filial") {
          await AsyncStorage.setItem(
            "userProfile",
            JSON.stringify(userProfile)
          );
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "ListagemMovimentacao" }],
            })
          );
        } else {
          await AsyncStorage.setItem(
            "userProfile",
            JSON.stringify(userProfile)
          );
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Motorista" }],
            })
          );
        }
      })
      .catch((error) => {
        console.log("Login error:", error);
        Alert.alert("Credenciais erradas, tente novamente");
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/medLogo.jpg")} style={styles.logo} />
      <Text style={styles.heading}>Fazer Login</Text>

      <View style={styles.form}>
        <View
          style={[
            styles.inputContainer,
            { borderColor: isEmailFocused ? "#00C2FF" : "transparent" },
          ]}
        >
          <MaterialIcons
            name="email"
            size={24}
            color="#00C2FF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            keyboardType="email-address"
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            { borderColor: isPasswordFocused ? "#00C2FF" : "transparent" },
          ]}
        >
          <FontAwesome
            name="lock"
            size={24}
            color="#00C2FF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Preenche toda a tela
    backgroundColor: "#0f172a", // Cor de fundo escura
    padding: 25,
    borderColor: "#1e293b", // Cor de borda escura
    borderWidth: 5,
    shadowColor: "#000", // Sombra escura
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    margin: 0, // Remove a margem
    justifyContent: "center", // Centraliza o conteúdo verticalmente
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  heading: {
    textAlign: "center",
    fontWeight: "900",
    fontSize: 30,
    color: "#00C2FF", // Cor azul clara para o título
  },
  form: {
    marginTop: 20,
    width: "100%", // Garante que o formulário ocupe toda a largura disponível
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b", // Fundo escuro para os inputs
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
    shadowColor: "#000", // Sombra escura
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    color: "#fff", // Cor branca para o texto dos inputs
  },
  icon: {
    marginRight: 10,
    color: "#00C2FF", // Cor dos ícones
  },
  forgotPassword: {
    marginTop: 10,
    marginLeft: 10,
    fontSize: 11,
    color: "#00C2FF", // Cor azul clara para o link de esquecimento de senha
  },
  loginButton: {
    backgroundColor: "#00C2FF", // Cor do botão de login
    paddingVertical: 15,
    borderRadius: 20,
    marginVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff", // Cor branca para o texto do botão
  },
  socialAccountContainer: {
    marginTop: 25,
  },
  socialTitle: {
    textAlign: "center",
    fontSize: 10,
    color: "#cbd5e1", // Cor cinza claro para o título de redes sociais
  },
  socialAccounts: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 5,
  },
  socialButton: {
    backgroundColor: "#334155", // Fundo escuro para os botões de redes sociais
    padding: 5,
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#1e293b", // Borda escura
    borderWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  agreement: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 9,
    color: "#00C2FF", // Cor azul clara para o texto de acordo
  },
});
