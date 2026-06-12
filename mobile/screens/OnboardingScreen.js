import React, { useContext, useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import { UserContext } from "../UserContext";
import { createUser } from "../api";

const roles = [
  { label: "Waste Generator", value: "GENERATOR", subtitle: "Report waste and request pickups." },
  { label: "Waste Hauler", value: "HAULER", subtitle: "Claim jobs and manage pickups." },
];

export default function OnboardingScreen({ navigation }) {
  const { setProfile } = useContext(UserContext);
  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleContinue = async () => {
    if (!selectedRole || !name || !phone) {
      Alert.alert("Missing fields", "Please choose a role and provide your name and phone number.");
      return;
    }

    try {
      const user = await createUser({ name, phone, role: selectedRole });
      if (!user || !user.id) throw new Error("Invalid response from server.");
      await setProfile({ role: selectedRole, userId: user.id, name, phone });
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Error", error.message || "Unable to create your profile. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to WastePin</Text>
      <Text style={styles.subtitle}>
        Choose how you will use WastePin so we can tailor the experience.
      </Text>
      {roles.map((role) => (
        <View key={role.value} style={[styles.card, selectedRole === role.value && styles.cardSelected]}>
          <Text style={styles.cardTitle}>{role.label}</Text>
          <Text style={styles.cardText}>{role.subtitle}</Text>
          <Button title={`Select ${role.label}`} onPress={() => setSelectedRole(role.value)} />
        </View>
      ))}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Jane Doe" />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput value={phone} onChangeText={setPhone} style={styles.input} placeholder="0700 000 000" keyboardType="phone-pad" />
      </View>
      <Button title="Create Profile" onPress={handleContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#eef5ff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: "#444",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  cardSelected: {
    borderColor: "#2f95dc",
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    marginBottom: 12,
    color: "#555",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
