import { getQiblaBearing } from "@/utils/qibla";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Compass } from "lucide-react-native";

type QiblaState =
  | { status: "loading" }
  | { status: "denied"; message: string }
  | { status: "error"; message: string }
  | { status: "ready"; bearing: number; lat: number; lon: number };

const COMPASS_SIZE = 260;
const NEEDLE_LENGTH = 90;

export default function QiblaScreen() {
  const [state, setState] = useState<QiblaState>({ status: "loading" });

  const fetchLocationAndBearing = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setState({
          status: "denied",
          message: "Lejo qasjen e lokacionit në cilësimet e aplikacionit për të parë drejtimin e Qibles.",
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;
      const bearing = getQiblaBearing(latitude, longitude);

      setState({ status: "ready", bearing, lat: latitude, lon: longitude });
    } catch (e) {
      setState({
        status: "error",
        message: e instanceof Error ? e.message : "Nuk u mor lokacioni.",
      });
    }
  }, []);

  useEffect(() => {
    fetchLocationAndBearing();
  }, [fetchLocationAndBearing]);

  return (
    <LinearGradient colors={["#ECFDF5", "#FFFFFF"]} style={styles.container}>
      <LinearGradient
        colors={["#059669", "#047857"]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <Compass size={28} color="white" />
          <Text style={styles.headerTitle}>Drejtimi i Qibles</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Drejt Kabes, Meka
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {state.status === "loading" && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.hint}>Duke marrë lokacionin...</Text>
          </View>
        )}

        {state.status === "denied" && (
          <View style={styles.centerBox}>
            <Compass size={64} color="#9CA3AF" />
            <Text style={styles.errorText}>{state.message}</Text>
          </View>
        )}

        {state.status === "error" && (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>{state.message}</Text>
          </View>
        )}

        {state.status === "ready" && (
          <>
            <View style={styles.compassWrap}>
              <View style={[styles.compassCircle]}>
                <Text style={[styles.cardinal, styles.cardinalN]}>N</Text>
                <Text style={[styles.cardinal, styles.cardinalE]}>E</Text>
                <Text style={[styles.cardinal, styles.cardinalS]}>S</Text>
                <Text style={[styles.cardinal, styles.cardinalW]}>W</Text>
                <View
                  style={[
                    styles.needle,
                    {
                      transform: [{ rotate: `${state.bearing}deg` }],
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.bearingValue}>
                {Math.round(state.bearing)}°
              </Text>
              <Text style={styles.bearingLabel}>
                nga veriu (drejt Qibles)
              </Text>
              <Text style={styles.coords}>
                {state.lat.toFixed(4)}°, {state.lon.toFixed(4)}°
              </Text>
            </View>
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingTop: 52,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: "white",
    opacity: 0.9,
    fontSize: 14,
    marginTop: 4,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: "center",
  },

  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },

  hint: {
    fontSize: 15,
    color: "#64748B",
  },

  errorText: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    paddingHorizontal: 24,
  },

  compassWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  compassCircle: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 3,
    borderColor: "#059669",
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  cardinal: {
    position: "absolute",
    fontSize: 18,
    fontWeight: "700",
    color: "#047857",
  },

  cardinalN: { top: 12 },
  cardinalE: { right: 16 },
  cardinalS: { bottom: 12 },
  cardinalW: { left: 16 },

  needle: {
    position: "absolute",
    width: 6,
    height: NEEDLE_LENGTH,
    backgroundColor: "#059669",
    borderRadius: 3,
    top: (COMPASS_SIZE - NEEDLE_LENGTH) / 2,
    left: (COMPASS_SIZE - 6) / 2,
  },

  infoCard: {
    marginTop: 28,
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 220,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  bearingValue: {
    fontSize: 42,
    fontWeight: "800",
    color: "#059669",
  },

  bearingLabel: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 4,
  },

  coords: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
  },
});
