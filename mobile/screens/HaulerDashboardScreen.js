import React, { useEffect, useState, useContext } from "react";
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";
import OsmMap from "../components/OsmMap";
import * as Location from "expo-location";
import { useIsFocused } from "@react-navigation/native";
import { UserContext } from "../UserContext";
import { fetchUser, fetchAssignedPins, completePin } from "../api";
import { optimizeRoute, estimateDuration, calculateDistance } from "../utils/routeOptimization";

export default function HaulerDashboardScreen({ navigation }) {
  const { userId } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [optimizedJobs, setOptimizedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeStats, setRouteStats] = useState(null);
  const isFocused = useIsFocused();

  const loadData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Get user and assigned jobs
      const [userData, assignedJobs] = await Promise.all([
        fetchUser(userId),
        fetchAssignedPins(userId),
      ]);
      setUser(userData);
      setJobs(assignedJobs);

      // Get current location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const loc = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        };
        setCurrentLocation(loc);

        // Optimize route
        if (assignedJobs.length > 0) {
          const { route, totalDistance } = optimizeRoute(loc.latitude, loc.longitude, assignedJobs);
          setOptimizedJobs(route);
          const duration = estimateDuration(totalDistance);
          setRouteStats({ distance: totalDistance.toFixed(1), ...duration });
        }
      }
    } catch (error) {
      console.warn("Dashboard load error", error);
      Alert.alert("Error", "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused, userId]);

  const handleComplete = async (pinId) => {
    try {
      await completePin(pinId, userId);
      loadData();
      Alert.alert("Success", "Pickup marked complete.");
    } catch (error) {
      Alert.alert("Error", "Unable to complete the pickup.");
    }
  };

  const fitToRoute = () => {};

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hauler Dashboard</Text>

      {user && (
        <View style={styles.statsCard}>
          <Text style={styles.statLabel}>Reputation Score</Text>
          <Text style={styles.statValue}>{user.reputation}</Text>
          <Text style={styles.statLabel}>Points Balance</Text>
          <Text style={styles.statValue}>{user.points}</Text>
        </View>
      )}

      {routeStats && (
        <View style={styles.routeStatsCard}>
          <Text style={styles.routeTitle}>Optimized Route</Text>
          <Text style={styles.routeStat}>{routeStats.distance} km</Text>
          <Text style={styles.routeStat}>{routeStats.hours}h {routeStats.minutes}m est.</Text>
        </View>
      )}

      <Text style={styles.mapLabel}>Job Map & Route</Text>
      <OsmMap pins={optimizedJobs} height={280} />

      <Button title="Fit Route to Screen" onPress={fitToRoute} />

      <View style={styles.toolbar}>
        <Button title="View Open Jobs" onPress={() => navigation.navigate("Jobs")} />
      </View>

      <Text style={styles.sectionTitle}>Assigned Jobs (Optimized Order)</Text>
      {optimizedJobs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No assigned jobs yet. Claim a job from the open jobs list.</Text>
        </View>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={optimizedJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.jobCard}>
              <Text style={styles.jobIndex}>Stop {index + 1}</Text>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobText}>{item.wasteType} · {item.quantity}</Text>
              <Text style={styles.jobText}>Status: {item.status}</Text>
              <Text style={styles.jobText}>Location: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
              <Text style={styles.jobText}>Contact: {item.contact || "Unknown"}</Text>
              {item.status === "CLAIMED" && (
                <Button title="Mark Complete" onPress={() => handleComplete(item.id)} />
              )}
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2f95dc",
  },
  routeStatsCard: {
    backgroundColor: "#e8f5e9",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  routeStat: {
    fontSize: 14,
    color: "#2a7f62",
    marginBottom: 4,
  },
  mapLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  map: {
    width: "100%",
    height: 280,
    borderRadius: 14,
    marginBottom: 12,
  },
  toolbar: {
    marginTop: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptyState: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: "#fff",
  },
  emptyText: {
    color: "#666",
  },
  jobCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  jobIndex: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2f95dc",
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  jobText: {
    color: "#444",
    marginBottom: 4,
  },
});
