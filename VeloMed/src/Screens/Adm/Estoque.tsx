import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

interface Product {
  id: string;
  product_name?: string; // Atualizar para 'product_name'
  branch_name?: string;
  quantity: number;
  image_url: string;
  description: string;
}

export function Estoque() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar produtos ao inicializar a tela
  useEffect(() => {
    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Inicialmente, exibir todos os produtos
      })
      .catch(() => console.log("Erro ao carregar produtos"));
  }, []);

  // Função para filtrar os produtos com base no termo de busca
  const handleSearch = () => {
    const term = searchTerm.toLowerCase();

    const filtered = products.filter((product) => {
      const productName = product.product_name
        ? product.product_name.toLowerCase()
        : ""; // Usando 'product_name'
      const branchName = product.branch_name
        ? product.branch_name.toLowerCase()
        : "";

      return productName.includes(term) || branchName.includes(term);
    });

    setFilteredProducts(filtered); // Atualiza a lista filtrada
  };

  // Renderizar cada item do FlatList
  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productContainer}>
      {/* Exibe a imagem do produto */}
      <Image source={{ uri: item.image_url }} style={styles.productImage} />
      <View style={styles.productDetails}>
        {/* Exibe o nome do produto */}
        <Text style={styles.productName}>
          {item.product_name || "Produto sem nome"}
        </Text>
        {/* Exibe o nome da filial */}
        <View style={styles.productRow}>
          <Text style={styles.productBranch}>
            Filial: {item.branch_name || "Sem filial"}
          </Text>
          <Text style={styles.productQuantity}>{item.quantity} Unidades</Text>
        </View>
        {/* Exibe a descrição do produto */}
        <Text numberOfLines={2} style={styles.productDescription}>
          {item.description || "Sem descrição disponível"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Buscar produtos por nome ou filial</Text>
      {/* Campo de entrada para busca */}
      <TextInput
        style={styles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Digite o nome do produto ou filial"
        placeholderTextColor="#6b7280"
      />
      {/* Botão para buscar */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      {/* Lista de produtos exibidos */}
      <FlatList
        data={filteredProducts} // Lista de produtos filtrados
        keyExtractor={(item) => item.id}
        renderItem={renderItem} // Função para renderizar cada produto
        style={styles.productList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
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
  searchButton: {
    backgroundColor: "#00C2FF",
    paddingVertical: 15,
    borderRadius: 20,
    marginVertical: 10,
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
  productList: {
    marginTop: 20,
  },
  productContainer: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  productBranch: {
    color: "#00C2FF",
    fontWeight: "bold",
    fontSize: 14,
  },
  productQuantity: {
    color: "#00C2FF",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "right",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  productDescription: {
    color: "#cbd5e1",
  },
});
