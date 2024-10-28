import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  Button,
  StyleSheet,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import axios from "axios";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { TopBar } from "../../components/Header";

interface Filial {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
}

interface Produto {
  product_id: string;
  product_name: string;
  quantity: number;
  branch_id: string;
}

export default function CadastroMovimentacao() {
  const [filialOrigem, setFilialOrigem] = useState("");
  const [filialDestino, setFilialDestino] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [filialOptions, setFilialOptions] = useState<Filial[]>([]);
  const [produtosOptions, setProdutosOptions] = useState<Produto[]>([]);
  const [produtosFiltradosOptions, setProdutosFiltradosOptions] = useState<
    Produto[]
  >([]);

  const navigation = useNavigation();

  function handleSelectFilialOrigem(value: string) {
    setFilialOrigem(value);
  }

  function handleSelectFilialDestino(value: string) {
    setFilialDestino(value);
  }

  useEffect(() => {
    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/branches/options")
      .then((response) => {
        console.log("Filiais recebidas:", response.data);
        setFilialOptions(response.data);
      })
      .catch((error) => {
        console.log("Erro ao carregar filiais:", error);
      });

    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/products/options")
      .then((response) => {
        console.log("Produtos recebidos:", response.data);
        setProdutosOptions(response.data);
      })
      .catch((error) => {
        console.log("Erro ao carregar produtos:", error);
      });
  }, []);

  useEffect(() => {
    if (filialOrigem) {
      const produtosFiltrados = produtosOptions.filter(
        (produto) => produto.branch_id === filialOrigem
      );
      setProdutosFiltradosOptions(produtosFiltrados);
    }
  }, [filialOrigem, produtosOptions]);

  useEffect(() => {
    if (quantidade && produtoSelecionado) {
      const produtoEncontrado = produtosOptions.find(
        (item) => String(item.product_id) === String(produtoSelecionado)
      );

      if (
        produtoEncontrado &&
        Number(quantidade) > produtoEncontrado.quantity
      ) {
        Alert.alert("Aviso", "Quantidade excede o disponível");
        setQuantidade("");
      }
    }
  }, [quantidade, produtoSelecionado]);

  const handleCadastro = () => {
    if (filialOrigem === filialDestino) {
      Alert.alert(
        "Erro",
        "As filiais de origem e destino devem ser diferentes"
      );
      return;
    }

    if (!produtoSelecionado || !quantidade || Number(quantidade) <= 0) {
      Alert.alert(
        "Erro",
        "Selecione um produto e informe uma quantidade válida"
      );
      return;
    }

    const movimentacao = {
      originBranchId: Number(filialOrigem),
      destinationBranchId: Number(filialDestino),
      productId: Number(produtoSelecionado),
      quantity: Number(quantidade),
      observations: observacoes,
    };

    axios
      .post(process.env.EXPO_PUBLIC_API_URL + "/movements", movimentacao)
      .then(() => {
        Alert.alert("Sucesso", "Movimentação cadastrada com sucesso");
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "ListagemMovimentacao" }],
          })
        );
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          Alert.alert("Erro", error.response.data.error);
        } else {
          Alert.alert("Erro", "Ocorreu um erro ao cadastrar a movimentação");
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <Text style={styles.label}>
        {filialDestino === filialOrigem
          ? "As filiais estão iguais"
          : "As filiais são diferentes"}
      </Text>

      <Text style={styles.label}>Filial origem</Text>
      <Picker
        selectedValue={filialOrigem}
        onValueChange={handleSelectFilialOrigem}
        style={styles.input}
      >
        <Picker.Item value="" label="" />
        {filialOptions.map((filial) => (
          <Picker.Item key={filial.id} value={filial.id} label={filial.name} />
        ))}
      </Picker>

      <Text style={styles.label}>Filial destino</Text>
      <Picker
        selectedValue={filialDestino}
        onValueChange={handleSelectFilialDestino}
        style={styles.input}
      >
        <Picker.Item value="" label="" />
        {filialOptions.map((filial) => (
          <Picker.Item key={filial.id} value={filial.id} label={filial.name} />
        ))}
      </Picker>

      <Text style={styles.label}>Produto</Text>
      <Picker
        selectedValue={produtoSelecionado}
        onValueChange={(value) => setProdutoSelecionado(value)}
        style={styles.input}
      >
        <Picker.Item value="" label="" />
        {produtosFiltradosOptions.map((produto) => (
          <Picker.Item
            key={produto.product_id}
            value={produto.product_id}
            label={`${produto.product_name} - ${produto.quantity} unid`}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        value={quantidade}
        onChangeText={setQuantidade}
        style={styles.input}
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        value={observacoes}
        onChangeText={setObservacoes}
        style={styles.observationInput}
        multiline={true}
        placeholder="Adicione observações sobre a movimentação"
      />

      <Button title="Cadastrar" onPress={handleCadastro} color="#00C2FF" />
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
  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
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
  observationInput: {
    backgroundColor: "#1e293b",
    color: "#fff",
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    height: 100,
    textAlignVertical: "top",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
});
