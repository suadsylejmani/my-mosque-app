import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { BookMarked, Search } from "lucide-react-native";

const hadiths = [
  {
    id: 1,
    category: "Faith",
    text: "Actions are judged by intentions, so each man will have what he intended.",
    source: "Sahih al-Bukhari 1, Sahih Muslim 1907",
    narrator: "Umar ibn Al-Khattab",
  },
  {
    id: 2,
    category: "Prayer",
    text: "The first matter that the slave will be brought to account for on the Day of Judgment is the prayer. If it is sound, then the rest of his deeds will be sound.",
    source: "Sunan al-Tirmidhi 413",
    narrator: "Abu Hurairah",
  },
  {
    id: 3,
    category: "Character",
    text: "The best among you are those who have the best manners and character.",
    source: "Sahih al-Bukhari 3559",
    narrator: "Abdullah ibn Amr",
  },
  {
    id: 4,
    category: "Knowledge",
    text: "Whoever follows a path in the pursuit of knowledge, Allah will make a path to Paradise easy for him.",
    source: "Sahih Muslim 2699",
    narrator: "Abu Hurairah",
  },
  {
    id: 5,
    category: "Charity",
    text: "Charity does not decrease wealth, no one forgives another except that Allah increases his honor.",
    source: "Sahih Muslim 2588",
    narrator: "Abu Hurairah",
  },
  {
    id: 6,
    category: "Family",
    text: "The best of you is the one who is best to his family, and I am the best of you to my family.",
    source: "Sunan al-Tirmidhi 3895",
    narrator: "Aisha",
  },
  {
    id: 7,
    category: "Mercy",
    text: "Those who are merciful will be shown mercy by the Most Merciful. Be merciful to those on earth and the One in the heavens will have mercy upon you.",
    source: "Sunan al-Tirmidhi 1924",
    narrator: "Abdullah ibn Amr",
  },
  {
    id: 8,
    category: "Faith",
    text: "None of you truly believes until he loves for his brother what he loves for himself.",
    source: "Sahih al-Bukhari 13, Sahih Muslim 45",
    narrator: "Anas ibn Malik",
  },
];

type Hadith = (typeof hadiths)[number];

export default function HadithScreen() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHadiths = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return hadiths;

    return hadiths.filter(
      (h) =>
        h.text.toLowerCase().includes(term) ||
        h.category.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <LinearGradient colors={["#FFFBEB", "#FFFFFF"]} style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#D97706", "#B45309"]} style={styles.header}>
        <View style={styles.headerRow}>
          <BookMarked size={28} color="white" />
          <Text style={styles.headerTitle}>Hadith</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Prophetic traditions and sayings
        </Text>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search Hadith..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredHadiths}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <HadithCard hadith={item} />}
      />
    </LinearGradient>
  );
}

function HadithCard({ hadith }: { hadith: Hadith }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{hadith.category}</Text>
        </View>
        <Text style={styles.cardIdText}>#{hadith.id}</Text>
      </View>

      <Text style={styles.hadithText}>{hadith.text}</Text>

      <View style={styles.metaBlock}>
        <Text style={styles.metaLine}>
          <Text style={styles.metaLabel}>Narrator:</Text> {hadith.narrator}
        </Text>
        <Text style={styles.metaSource}>
          <Text style={styles.metaLabel}>Source:</Text> {hadith.source}
        </Text>
      </View>
    </View>
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
    marginBottom: 6,
  },

  headerTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: "white",
    opacity: 0.9,
    fontSize: 13,
    marginTop: 4,
  },

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

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 24,
    gap: 14,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  badge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgeText: {
    color: "#B45309",
    fontSize: 12,
    fontWeight: "700",
  },

  cardIdText: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "600",
  },

  hadithText: {
    color: "#111827",
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
    marginBottom: 14,
  },

  metaBlock: {
    gap: 4,
  },

  metaLine: {
    fontSize: 13,
    color: "#4B5563",
  },

  metaSource: {
    fontSize: 12,
    color: "#6B7280",
  },

  metaLabel: {
    fontWeight: "700",
    color: "#374151",
  },
});
