import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Button,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { TopBar } from "../../components/Header";

export function NovoUsuario() {
  const [profile, setProfile] = useState("motorista");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  // Função de validação
  function validateForm() {
    if (!name || !document || !fullAddress || !email || !password) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return false;
    }

    if (profile === "motorista" && document.length !== 11) {
      Alert.alert("Erro", "CPF deve ter 11 dígitos.");
      return false;
    } else if (profile === "filial" && document.length !== 14) {
      Alert.alert("Erro", "CNPJ deve ter 14 dígitos.");
      return false;
    }

    if (!email.includes("@")) {
      Alert.alert("Erro", "Email inválido.");
      return false;
    }

    return true;
  }

  function saveUser() {
    if (!validateForm()) return;

    setIsLoading(true);

    axios
      .post(process.env.EXPO_PUBLIC_API_URL + "/register", {
        profile: profile,
        name: name,
        document: document,
        full_address: fullAddress,
        email: email,
        password: password,
        active: true, // Define o usuário como ativo inicialmente
      })
      .then(() => {
        setIsModalVisible(true);
        setName("");
        setDocument("");
        setFullAddress("");
        setEmail("");
        setPassword("");
        setProfile("motorista");
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Erro ao cadastrar:", error);
        Alert.alert("Erro", "Não foi possível cadastrar o usuário.");
        setIsLoading(false);
      });
  }

  function handleCloseModal() {
    setIsModalVisible(false);
    navigation.dispatch(
      CommonActions.navigate({
        name: "Usuarios",
      })
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <View style={styles.containerOptions}>
        <TouchableOpacity
          style={[
            styles.optionProfile,
            profile === "motorista" && styles.selectedOption,
          ]}
          onPress={() => setProfile("motorista")}
        >
          <MaterialCommunityIcons
            name="motorbike-electric"
            size={30}
            color={profile === "motorista" ? "#fff" : "#00C2FF"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionProfile,
            profile === "filial" && styles.selectedOption,
          ]}
          onPress={() => setProfile("filial")}
        >
          <MaterialCommunityIcons
            name="store"
            size={30}
            color={profile === "filial" ? "#fff" : "#00C2FF"}
          />
        </TouchableOpacity>
      </View>

      {/* FORMULARIO DE CADASTRO DE USUARIO */}
      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Digite seu nome completo"
        placeholderTextColor="#cbd5e1"
      />

      <Text style={styles.label}>
        {profile === "motorista" ? "CPF" : "CNPJ"}
      </Text>
      <TextInput
        style={styles.input}
        value={document}
        onChangeText={setDocument}
        keyboardType="numeric"
        placeholder={
          profile === "motorista"
            ? "Digite seu CPF (11 dígitos)"
            : "Digite seu CNPJ (14 dígitos)"
        }
        placeholderTextColor="#cbd5e1"
      />

      <Text style={styles.label}>Endereço Completo</Text>
      <TextInput
        style={styles.input}
        value={fullAddress}
        onChangeText={setFullAddress}
        placeholder="Digite seu endereço completo"
        placeholderTextColor="#cbd5e1"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
        placeholderTextColor="#cbd5e1"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        placeholderTextColor="#cbd5e1"
        secureTextEntry
      />

      {/* Botão de cadastrar */}
      <TouchableOpacity style={styles.loginButton} onPress={saveUser}>
        <Text style={styles.buttonText}>
          {isLoading ? "Carregando..." : "Cadastrar"}
        </Text>
      </TouchableOpacity>

      {/* Modal de confirmação */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Usuário cadastrado com sucesso!
            </Text>
            <Button title="Fechar" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
    justifyContent: "center",
  },
  containerOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  optionProfile: {
    width: 100,
    height: 50,
    backgroundColor: "#1e293b",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderColor: "#1e293b",
    borderWidth: 2,
  },
  selectedOption: {
    backgroundColor: "#00C2FF",
  },
  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  label: {
    color: "#cbd5e1",
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: "#00C2FF",
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
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
});
