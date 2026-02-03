import { LinearGradient } from "expo-linear-gradient";
import { BookOpen, Calendar } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

/** Same gradient and height as Home tab header. */
const HEADER_GRADIENT = ["#059669", "#047857"] as const;

export function SurahListHeader() {
  return (
    <LinearGradient
        colors={["#059669", "#047857"]}
        style={styles.header}
      >
        <View style={styles.row}>
          <BookOpen size={28} color="white" />
          <Text style={styles.title}>Kurani i Lartesuar</Text>
        </View>

        <View style={[styles.rowCenter, { marginTop: 6 }]}>
          <Calendar size={16} color="white" />
          <Text style={styles.headerSmallText}>{new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</Text>
        </View>

        <Text style={[styles.headerSmallText, { marginTop: 6 }]}>
          {new Date().toLocaleDateString("albanian", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 52,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: "white",
    opacity: 0.9,
    fontSize: 13,
    marginTop: 4,
  },
  rowCenter: { flexDirection: "row", alignItems: "center", gap: 8 },

  headerSmallText: {
    color: "white",
    fontSize: 13,
    opacity: 0.9,
  },

  headerTitle: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 8,
  },
});
