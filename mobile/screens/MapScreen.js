import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { fetchPins } from "../api";

export default function MapScreen({ navigation }) {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapRegion = pins.length
    ? {
        latitude: pins.reduce((sum, pin) => sum + pin.latitude, 0) / pins.length,
        longitude: pins.reduce((sum, pin) => sum + pin.longitude, 0) / pins.length,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }
    : {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 100,
        longitudeDelta: 100,
      };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const fetchedPins = await fetchPins();
        if (!mounted) return;
        setPins(fetchedPins);
      } catch (error) {
        console.warn("Unable to load map pins", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!pins.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No waste collection points found yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={mapRegion} mapType="none">
        <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
            title={pin.title}
            description={`${pin.wasteType} · ${pin.quantity}`}
            onPress={() => navigation.navigate("JobDetail", { pin })}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  map: {
    flex: 1,
  },
});
