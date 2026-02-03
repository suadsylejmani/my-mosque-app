import type { SurahMeta } from "@/hooks/use-quran";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Search } from "lucide-react-native";

import { SurahListHeader } from "./SurahListHeader";
import { QURAN_PRIMARY } from "./theme";
import { SurahListItem } from "./SurahListItem";

export type SurahListProps = {
  surahs: SurahMeta[];
  isLoading?: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSurahPress: (surahNumber: number) => void;
};

export function SurahList({
  surahs,
  isLoading,
  searchTerm,
  onSearchChange,
  onSurahPress,
}: SurahListProps) {
  return (
    <LinearGradient colors={["#ECFDF5", "#FFFFFF"]} style={styles.container}>
      <SurahListHeader />

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            value={searchTerm}
            onChangeText={onSearchChange}
            placeholder="Search Surah..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color={QURAN_PRIMARY} />
          <View style={styles.loadingSpacer} />
        </View>
      ) : (
        <FlatList
          data={surahs}
          keyExtractor={(item) => String(item.number)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SurahListItem
              surah={item}
              onPress={() => onSurahPress(item.number)}
            />
          )}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingSpacer: { height: 40 },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 24,
    gap: 12,
  },
});
