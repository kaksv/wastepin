import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import OsmMap from "../components/OsmMap";
import { fetchPins } from "../api";

export default function MapScreen({ navigation }) {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const fetched = await fetchPins();
        if (mounted) setPins(Array.isArray(fetched) ? fetched : []);
      } catch (err) {
        if (mounted) setError(err.message || "Unable to load pins.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.hint}>Connecting to server…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!pins.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.hint}>No waste collection points found yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OsmMap pins={pins} height={600} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  hint: { fontSize: 16, color: "#666", textAlign: "center", marginTop: 10 },
  error: { fontSize: 15, color: "#c0392b", textAlign: "center" },
});
