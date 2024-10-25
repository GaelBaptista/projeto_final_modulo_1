import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen } from "./src/Screens/SplashScreen";
import { IntroScreen } from "./src/Screens/InstroScreen";
import { LoginScreen } from "./src/Screens/LoginScreen";
import { StatusBar } from "react-native";
import { Home } from "./src/Screens/Adm/Home";
import { Estoque } from "./src/Screens/Adm/Estoque";
import { Usuarios } from "./src/Screens/Adm/Usuarios";
import { CadastroMovimentacao } from "./src/Screens/Filial/CadastroMovimentacoes";
import { ListagemMovimentacoes } from "./src/Screens/Filial/ListagemMovimentacao";
import { ListagemMovimentacoesMotorista } from "./src/Screens/Motorista/Motorista";
import { NovoUsuario } from "./src/Screens/Adm/NovoUsuario";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="#00C2FF"
      />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Intro"
          component={IntroScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Estoque"
          component={Estoque}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Usuarios"
          component={Usuarios}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NovoUsuario"
          component={NovoUsuario}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CadastroMovimentacao"
          component={CadastroMovimentacao}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListagemMovimentacao"
          component={ListagemMovimentacoes}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Motorista"
          component={ListagemMovimentacoesMotorista}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
