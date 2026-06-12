import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function OsmMap({ pins = [], height = 220 }) {
  const center = pins.length
    ? [
        pins.reduce((s, p) => s + p.latitude, 0) / pins.length,
        pins.reduce((s, p) => s + p.longitude, 0) / pins.length,
      ]
    : [0.3476, 32.5825];

  const markers = pins
    .map(
      (p) =>
        `L.marker([${p.latitude},${p.longitude}]).addTo(map).bindPopup(${JSON.stringify(
          `<b>${p.title}</b><br/>${p.wasteType} · ${p.quantity}`
        )})`
    )
    .join(";\n");

  const html = `<!DOCTYPE html><html><head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>html,body,#map{margin:0;padding:0;height:100%;width:100%;}</style>
  </head><body>
    <div id="map"></div>
    <script>
      var map = L.map('map').setView([${center[0]},${center[1]}],13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
      ${markers}
    </script>
  </body></html>`;

  return (
    <View style={[styles.container, { height }]}>
      <WebView source={{ html }} style={styles.webview} scrollEnabled={false} javaScriptEnabled />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 14, overflow: "hidden" },
  webview: { flex: 1 },
});
