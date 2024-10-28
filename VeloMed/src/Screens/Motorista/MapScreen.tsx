import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useRoute } from "@react-navigation/native";

export function Map() {
  const route = useRoute();
  const { origin, destination } = route.params;

  const originCoordinate = {
    latitude: origin.latitude,
    longitude: origin.longitude,
  };
  const destinationCoordinate = {
    latitude: destination.latitude,
    longitude: destination.longitude,
  };

  const initialRegion = {
    latitude: (origin.latitude + destination.latitude) / 2,
    longitude: (origin.longitude + destination.longitude) / 2,
    latitudeDelta: Math.abs(origin.latitude - destination.latitude) * 1.5,
    longitudeDelta: Math.abs(origin.longitude - destination.longitude) * 1.5,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        <Marker coordinate={originCoordinate} title="Origem" pinColor="green" />

        <Marker
          coordinate={destinationCoordinate}
          title="Destino"
          pinColor="red"
        />

        <Polyline
          coordinates={[originCoordinate, destinationCoordinate]}
          strokeColor="#00C2FF"
          strokeWidth={4}
        />
      </MapView>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Origem: {origin.nome}</Text>
        <Text style={styles.infoText}>Destino: {destination.nome}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  infoContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
