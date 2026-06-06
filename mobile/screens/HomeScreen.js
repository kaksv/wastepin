import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { UserContext } from "../UserContext";

export default function HomeScreen({ navigation }) {
  const { role, name, phone, clearProfile } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WastePin</Text>
      <Text style={styles.subtitle}>
        {role === "HAULER"
          ? "Claim local jobs, optimize pickups, and build your reputation."
          : "Drop a map pin, request a pickup, and get reliable collection support."}
      </Text>
      <Text style={styles.role}>Current role: {role || "Not selected"}</Text>
      {name ? <Text style={styles.profileText}>Hello, {name}</Text> : null}
      {phone ? <Text style={styles.profileText}>Phone: {phone}</Text> : null}
      <View style={styles.buttonRow}>
        <Button title="Create Waste Pin" onPress={() => navigation.navigate("NewPin")} />
      </View>
      <View style={styles.buttonRow}>
        <Button title="View Available Jobs" onPress={() => navigation.navigate("Jobs")} />
      </View>
      {role === "HAULER" && (
        <View style={styles.buttonRow}>
          <Button title="Hauler Dashboard" onPress={() => navigation.navigate("HaulerDashboard")} />
        </View>
      )}
      <View style={styles.buttonRow}>
        <Button title="Change Role" color="#c0392b" onPress={() => { clearProfile(); navigation.replace("Onboarding"); }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: "#555",
  },
  role: {
    fontSize: 14,
    marginBottom: 8,
    color: "#777",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  profileText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
  buttonRow: {
    marginTop: 12,
  },
});
