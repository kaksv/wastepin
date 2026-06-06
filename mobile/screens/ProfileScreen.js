import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { UserContext } from "../UserContext";

export default function ProfileScreen({ navigation }) {
  const { role, name, phone, clearProfile } = useContext(UserContext);

  const handleRegister = () => navigation.navigate("Onboarding");
  const handleReset = async () => {
    await clearProfile();
    navigation.navigate("Onboarding");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {role ? (
        <View style={styles.card}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{role}</Text>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{name}</Text>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{phone}</Text>
          <View style={styles.buttonRow}>
            <Button title="Change Role" onPress={handleReset} color="#d35400" />
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.subtitle}>Create your WastePin profile to start adding pins and claiming jobs.</Text>
          <View style={styles.buttonRow}>
            <Button title="Register Now" onPress={handleRegister} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f3f7ff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 18,
    lineHeight: 22,
  },
  buttonRow: {
    marginTop: 20,
  },
});
