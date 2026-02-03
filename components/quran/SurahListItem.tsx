import type { SurahMeta } from "@/hooks/use-quran";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { QURAN_HEADER_GRADIENT } from "./theme";

export type SurahListItemProps = {
  surah: SurahMeta;
  onPress: () => void;
};

export function SurahListItem({ surah, onPress }: SurahListItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.row}>
        <LinearGradient
          colors={QURAN_HEADER_GRADIENT}
          style={styles.badge}
        >
          <Text style={styles.badgeText}>{surah.number}</Text>
        </LinearGradient>

        <View style={styles.middle}>
          <Text style={styles.name} numberOfLines={1}>
            {surah.name}
          </Text>
          <Text style={styles.translation} numberOfLines={1}>
            {surah.translation}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{surah.verses} verses</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{surah.revelation}</Text>
          </View>
        </View>

        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  middle: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  translation: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  metaDot: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
