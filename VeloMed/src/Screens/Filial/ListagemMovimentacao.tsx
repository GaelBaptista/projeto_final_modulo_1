import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import {
  useNavigation,
  useIsFocused,
  CommonActions,
} from "@react-navigation/native";
import { TopBar } from "../../components/Header";

interface Movimentacao {
  id: string;
  origem: { nome: string };
  destino: { nome: string };
  produto: { nome: string; unidade: string };
  quantity: number;
  status: string;
}

export function ListagemMovimentacoes() {
  const [movements, setMovements] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await axios.get(
          process.env.EXPO_PUBLIC_API_URL + "/movements"
        );
        setMovements(response.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar movimentações:", err);
        setError("Erro ao carregar as movimentações.");
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchMovements();
    }
  }, [isFocused]);

  const renderItem = ({ item }: { item: Movimentacao }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>
        <Text style={styles.cardLabel}>Origem:</Text>{" "}
        {item.origem?.nome || "Não especificado"}
      </Text>
      <Text style={styles.cardText}>
        <Text style={styles.cardLabel}>Destino:</Text>{" "}
        {item.destino?.nome || "Não especificado"}
      </Text>
      <Text style={styles.cardText}>
        <Text style={styles.cardLabel}>Produto:</Text>{" "}
        {item.produto?.nome || "Não especificado"} - {item.quantity}{" "}
        {item.produto?.unidade || "unid"}
      </Text>
      <Text style={styles.cardText}>
        <Text style={styles.cardLabel}>Status:</Text> {item.status || "N/A"}
      </Text>
    </View>
  );

  const handleAddMovimentacao = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "CadastroMovimentacao" }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddMovimentacao}
      >
        <Text style={styles.buttonText}>Adicionar movimentação</Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>
              Nenhuma movimentação encontrada.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
    marginTop: 30,
  },
  addButton: {
    backgroundColor: "#00C2FF",
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  list: {
    marginTop: 20,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardText: {
    color: "#fff",
    marginBottom: 5,
  },
  cardLabel: {
    fontWeight: "bold",
    color: "#00C2FF",
  },
  loadingText: {
    color: "#fff",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 20,
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
  },
});
