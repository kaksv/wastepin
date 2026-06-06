import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
import { createPin } from "../api";
import { UserContext } from "../UserContext";

const wasteTypes = ["ORGANIC", "PLASTIC", "CONSTRUCTION", "ELECTRONICS", "OTHER"];

export default function NewPinScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ latitude: 0.3476, longitude: 32.5825 });
  const [region, setRegion] = useState({
    latitude: 0.3476,
    longitude: 32.5825,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [wasteType, setWasteType] = useState("ORGANIC");
  const [quantity, setQuantity] = useState("");
  const [contact, setContact] = useState("");
  const [photos, setPhotos] = useState([]);
  const { userId } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const coords = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setLocation(coords);
        setRegion(coords);
      }
    })();
  }, []);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied", "We need photo access to upload waste images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const selected = result.assets ? result.assets.map((asset) => asset.uri) : [result.uri];
      setPhotos((prev) => [...prev, ...selected]);
    }
  };

  const handleSubmit = async () => {
    try {
      const pin = await createPin({
        title,
        description,
        latitude: location.latitude,
        longitude: location.longitude,
        wasteType,
        quantity,
        contact,
        photos: JSON.stringify(photos),
        creatorId: userId,
      });
      Alert.alert("Created", `Waste pin created: ${pin.id}`);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Unable to create waste pin.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Waste location</Text>
      <MapView style={styles.map} region={region} onPress={handleMapPress} onRegionChangeComplete={setRegion}>
        <Marker coordinate={location} draggable onDragEnd={handleMapPress} />
      </MapView>
      <Text style={styles.smallText}>Tap the map or drag the pin to mark the pickup location.</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Household waste pickup" />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="E.g., 3 bags of mixed plastic and organic waste"
        multiline
      />

      <Text style={styles.label}>Waste Type</Text>
      <View style={styles.typeRow}>
        {wasteTypes.map((type) => (
          <TouchableOpacity key={type} style={[styles.typePill, wasteType === type && styles.typeSelected]} onPress={() => setWasteType(type)}>
            <Text style={[styles.typeLabel, wasteType === type && styles.typeLabelSelected]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Quantity</Text>
      <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} placeholder="3 sacks" />

      <Text style={styles.label}>Contact</Text>
      <TextInput style={styles.input} value={contact} onChangeText={setContact} placeholder="Phone or WhatsApp" />

      <Text style={styles.label}>Photos</Text>
      <Button title="Add Photos" onPress={handlePickPhoto} />
      <View style={styles.photoRow}>
        {photos.map((uri) => (
          <Image key={uri} source={{ uri }} style={styles.photo} />
        ))}
      </View>

      <Button title="Submit Waste Pin" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "600",
  },
  smallText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  typePill: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: "#f0f4ff",
    marginRight: 8,
    marginBottom: 8,
  },
  typeSelected: {
    backgroundColor: "#2f95dc",
  },
  typeLabel: {
    color: "#2f95dc",
    fontWeight: "600",
  },
  typeLabelSelected: {
    color: "#fff",
  },
  photoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  photo: {
    width: 88,
    height: 88,
    borderRadius: 12,
    marginRight: 10,
    marginTop: 10,
  },
});
