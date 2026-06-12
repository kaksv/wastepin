import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { fetchPins } from "../api";

export default function JobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const pins = await fetchPins();
        setJobs(Array.isArray(pins) ? pins : []);
      } catch (err) {
        Alert.alert("Error", err.message || "Unable to load jobs.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("JobDetail", { pin: item })}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.wasteType} · {item.quantity}</Text>
            <Text style={styles.location}>Lat {item.latitude.toFixed(4)}, Lon {item.longitude.toFixed(4)}</Text>
            <Text style={styles.contact}>{item.contact || "No contact provided"}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#555",
    marginBottom: 8,
  },
  location: {
    color: "#888",
    marginBottom: 4,
  },
  contact: {
    color: "#333",
    fontWeight: "600",
  },
});
