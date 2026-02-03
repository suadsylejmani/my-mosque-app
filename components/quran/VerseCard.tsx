import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { QURAN_HEADER_GRADIENT } from "./theme";

export type VerseCardProps = {
  aya: number;
  arabic: string;
  albanian: string;
};

export function VerseCard({ aya, arabic, albanian }: VerseCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.badgeWrap}>
        <LinearGradient
          colors={QURAN_HEADER_GRADIENT}
          style={styles.badge}
        >
          <Text style={styles.badgeText}>{aya}</Text>
        </LinearGradient>
      </View>
      <Text style={styles.arabicText}>{arabic}</Text>
      {albanian ? (
        <Text style={styles.albanianText}>{albanian}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  badgeWrap: {
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  arabicText: {
    fontSize: 22,
    color: "#0F172A",
    lineHeight: 38,
    textAlign: "right",
    writingDirection: "rtl",
  },
  albanianText: {
    marginTop: 12,
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
    fontStyle: "italic",
  },
});
