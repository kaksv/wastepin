import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { UserContext } from "../UserContext";
import { fetchPins } from "../api";

export default function WelcomeScreen({ navigation }) {
  const { role, name, phone } = useContext(UserContext);
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapRegion = pins.length
    ? {
        latitude: pins.reduce((sum, pin) => sum + pin.latitude, 0) / pins.length,
        longitude: pins.reduce((sum, pin) => sum + pin.longitude, 0) / pins.length,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }
    : null;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError(null);
        const fetchedPins = await fetchPins();
        if (!mounted) return;
        setPins(fetchedPins);
      } catch (err) {
        if (mounted) setError(err.message || "Unable to load pins.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleRegister = () => navigation.navigate("Onboarding");
  const handleGoHome = () => navigation.navigate("Home");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WastePin</Text>
      <Text style={styles.subtitle}>
        Browse local rubbish collection points and open pickup requests. Register only when you want to create or claim jobs.
      </Text>

      {role ? (
        <View style={styles.profileCard}>
          <Text style={styles.profileTitle}>Welcome back{stringifyName(name)}!</Text>
          <Text style={styles.profileText}>Role: {role}</Text>
          {phone ? <Text style={styles.profileText}>Phone: {phone}</Text> : null}
          <Button title="Go to your dashboard" onPress={handleGoHome} />
        </View>
      ) : (
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Want to do more?</Text>
          <Text style={styles.ctaText}>
            Register to add waste pins, claim jobs, and manage your pickup activity.
          </Text>
          <Button title="Register / Join WastePin" onPress={handleRegister} />
        </View>
      )}

      <Text style={styles.sectionTitle}>Recent Waste Pins</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.emptyText}>Connecting to server…</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: "#c0392b" }]}>{error}</Text>
          <Button title="Retry" onPress={() => { setLoading(true); setError(null); fetchPins().then(setPins).catch(err => setError(err.message)).finally(() => setLoading(false)); }} />
        </View>
      ) : pins.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No collection points available yet.</Text>
        </View>
      ) : (
        <>
          {mapRegion ? (
            <View style={styles.mapWrapper}>
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
          ) : null}

          <FlatList
            data={pins}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pinCard}
                onPress={() => navigation.navigate("JobDetail", { pin: item })}
              >
                <Text style={styles.pinTitle}>{item.title}</Text>
                <Text style={styles.pinSubtitle}>{item.wasteType} · {item.quantity}</Text>
                <Text style={styles.pinLocation}>Lat {item.latitude.toFixed(4)}, Lon {item.longitude.toFixed(4)}</Text>
                {item.contact ? <Text style={styles.pinContact}>{item.contact}</Text> : null}
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
}

function stringifyName(name) {
  if (!name) return "";
  return `, ${name}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f3f7ff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    lineHeight: 22,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  profileText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
  ctaCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  loadingContainer: {
    paddingTop: 30,
    alignItems: "center",
  },
  emptyContainer: {
    paddingTop: 30,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
  },
  pinCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pinTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  pinSubtitle: {
    color: "#555",
    marginBottom: 8,
  },
  pinLocation: {
    color: "#888",
    marginBottom: 6,
  },
  pinContact: {
    color: "#333",
    fontWeight: "600",
  },
  mapWrapper: {
    height: 200,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#e6eefc",
  },
  map: {
    flex: 1,
  },
});
