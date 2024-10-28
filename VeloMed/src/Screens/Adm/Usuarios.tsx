import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import {
  CommonActions,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TopBar } from "../../components/Header";

interface User {
  id: number;
  name: string;
  profile: string;
  active: boolean;
}

export function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [animation] = useState(new Animated.Value(1));
  const navigation = useNavigation();

  const fetchUsers = () => {
    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/users")
      .then((response) => {
        const updatedUsers = response.data.map((user: User) => ({
          ...user,
          active: user.active ?? true,
        }));
        setUsers(updatedUsers.reverse());
      })
      .catch((error) => {
        console.log("API Error:", error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const toggleUserStatus = (id: number, isActive: boolean) => {
    const newStatus = !isActive;
    axios
      .patch(process.env.EXPO_PUBLIC_API_URL + `/users/${id}/toggle-status`, {
        active: newStatus,
      })
      .then((response) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, active: newStatus } : user
          )
        );
      })
      .catch((error) => {
        console.log("Error updating status:", error);
        Alert.alert("Error", "Could not update user status.");
      });
  };

  const redirectToNewUser = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: "NovoUsuario",
      })
    );
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <TouchableOpacity
        style={styles.newUserButton}
        onPress={redirectToNewUser}
      >
        <Text style={styles.newUserButtonText}>Cadastrar Novo Usuário</Text>
      </TouchableOpacity>

      {users.length === 0 ? (
        <Text style={styles.noUsersText}>No users available</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item: User) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <View
              style={[
                styles.userCard,
                item.active ? styles.activeUser : styles.inactiveUser,
              ]}
            >
              <View style={styles.userInfo}>
                <MaterialCommunityIcons
                  name={item.profile === "motorista" ? "motorbike" : "store"}
                  size={30}
                  color={item.active ? "#00C2FF" : "#1e293b"}
                />
                <Text
                  style={[
                    styles.userName,
                    !item.active && styles.strikethroughText,
                  ]}
                >
                  {item.name}
                </Text>
                <Text style={styles.userType}>
                  {item.profile === "motorista" ? "Motorista" : "Filial"}
                </Text>
              </View>
              <Switch
                value={item.active}
                onValueChange={() => toggleUserStatus(item.id, item.active)}
                trackColor={{ false: "#222", true: "#00C2FF" }}
                thumbColor={item.active ? "#00C2FF" : "#555"}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30,
    backgroundColor: "#0f172a",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  newUserButton: {
    backgroundColor: "#00C2FF",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  newUserButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeUser: {
    borderColor: "#00C2FF",
    borderWidth: 2,
    backgroundColor: "#1e293b",
  },
  inactiveUser: {
    backgroundColor: "#222",
    borderColor: "#555",
    borderWidth: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
  strikethroughText: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  userType: {
    color: "#6B7280",
  },
  noUsersText: {
    textAlign: "center",
    color: "#6B7280",
  },
});
