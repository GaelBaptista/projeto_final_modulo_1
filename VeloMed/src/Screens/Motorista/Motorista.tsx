import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopBar } from "../../components/Header";

interface Movement {
  id: number;
  produto: {
    name: string;
    imagem: string;
  };
  quantidade: number;
  status: string;
  origem: {
    nome: string;
    latitude: number;
    longitude: number;
  };
  destino: {
    nome: string;
    latitude: number;
    longitude: number;
  };
  historico: Array<any>;
}

export function ListagemMovimentacoesMotorista() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const response = await axios.get(
        process.env.EXPO_PUBLIC_API_URL + "/movements"
      );
      setMovements(response.data);
    } catch (error) {
      console.log("Erro ao carregar movimentações:", error);
    }
  };

  const handleCaptureImage = async (id: number, status: string) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão para acessar a câmera é necessária!");
      return;
    }

    const photo = await ImagePicker.launchCameraAsync();
    if (!photo.cancelled) {
      const formData = new FormData();
      formData.append("file", {
        uri: photo.uri,
        type: "image/jpg",
        name: `movement_${id}_${status}.jpg`,
      });
      formData.append("motorista", "Douglas");

      const endpoint =
        process.env.EXPO_PUBLIC_API_URL +
        `/movements/${id}/${status === "Created" ? "start" : "end"}`;

      try {
        await axios.put(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Alert.alert("Movimentação atualizada com sucesso!");
        fetchMovements();
      } catch (error) {
        console.log("Erro ao atualizar movimentação:", error);
      }
    }
  };

  const renderMovement = ({ item }: { item: Movement }) => {
    const isCreated = item.status === "Created";
    const isInTransit = item.status === "Em Trânsito";
    const isCompleted = item.status === "Coleta Finalizada";

    const progress = isCreated ? 0.3 : isInTransit ? 0.6 : 1;

    return (
      <View
        style={[styles.card, isCompleted ? styles.cardGreen : styles.cardDark]}
      >
        <View style={styles.cardHeader}>
          <Image
            source={{ uri: item.produto.imagem }}
            style={styles.productImage}
          />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{item.produto.name}</Text>
            <Text style={styles.productQuantity}>
              {item.quantidade} Unidades
            </Text>
            <Text style={styles.productLocation}>
              Origem: {item.origem.nome}
            </Text>
            <Text style={styles.productLocation}>
              Destino: {item.destino.nome}
            </Text>
            <Text style={styles.productStatus}>Status: {item.status}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <MaterialIcons name="directions-bike" size={24} color="#00C2FF" />
          <View style={styles.progressBarBackground}>
            <View
              style={[styles.progressBarFill, { width: `${progress * 50}%` }]}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isCreated && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCaptureImage(item.id, "start")}
            >
              <Text style={styles.buttonText}>Iniciar Entrega</Text>
            </TouchableOpacity>
          )}

          {progress === 1 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCaptureImage(item.id, "end")}
            >
              <Text style={styles.buttonText}>Finalizar Entrega</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() =>
              navigation.navigate("MapScreen", {
                origin: item.origem,
                destination: item.destino,
              })
            }
          >
            <Text style={styles.buttonText}>Mapa</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <FlatList
        data={movements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovement}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  listContainer: {
    padding: 20,
    backgroundColor: "#0f172a",
  },
  card: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#1e293b",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardDark: {
    backgroundColor: "#1e293b",
  },
  cardGreen: {
    backgroundColor: "#2d3748",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  productQuantity: {
    fontSize: 16,
    color: "#00C2FF",
    marginTop: 5,
  },
  productLocation: {
    fontSize: 14,
    color: "#cbd5e1",
  },
  productStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00C2FF",
    marginTop: 5,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#334155",
    borderRadius: 5,
    marginLeft: 10,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#00C2FF",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  mapButton: {
    flex: 1,
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
