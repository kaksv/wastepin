import React, { useState, useContext } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { claimPin, completePin } from "../api";
import { UserContext } from "../UserContext";

export default function JobDetailScreen({ route }) {
  const { userId } = useContext(UserContext);
  const { pin } = route.params;
  const [status, setStatus] = useState(pin.status);

  const handleClaim = async () => {
    try {
      const updated = await claimPin(pin.id, userId);
      setStatus(updated.status);
      Alert.alert("Claimed", "Job claimed successfully.");
    } catch (error) {
      Alert.alert("Error", "Unable to claim this job.");
    }
  };

  const handleComplete = async () => {
    try {
      const updated = await completePin(pin.id, userId);
      setStatus(updated.status);
      Alert.alert("Completed", "Pickup marked complete.");
    } catch (error) {
      Alert.alert("Error", "Unable to complete this pickup.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{pin.title}</Text>
      <Text style={styles.detail}>{pin.description || "No description"}</Text>
      <Text style={styles.detail}>Waste type: {pin.wasteType}</Text>
      <Text style={styles.detail}>Quantity: {pin.quantity}</Text>
      <Text style={styles.detail}>Contact: {pin.contact || "Unknown"}</Text>
      <Text style={styles.detail}>Status: {status}</Text>
      <Text style={styles.detail}>Location: {pin.latitude.toFixed(4)}, {pin.longitude.toFixed(4)}</Text>
      {status === "OPEN" ? (
        <Button title="Claim Job" onPress={handleClaim} />
      ) : status === "CLAIMED" ? (
        <Button title="Mark Complete" onPress={handleComplete} />
      ) : (
        <Text style={styles.completedText}>This pickup is already completed.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
  },
  completedText: {
    marginTop: 16,
    fontSize: 16,
    color: "#2a7f62",
    fontWeight: "600",
  },
});
