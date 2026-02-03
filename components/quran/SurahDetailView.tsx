import { useSurahArabic, useSurahTranslation } from "@/hooks/use-quran";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";

import { VerseCard } from "./VerseCard";
import { QURAN_HEADER_GRADIENT, QURAN_PRIMARY } from "./theme";

export type SurahDetailViewProps = {
  surahNumber: number;
  surahName: string;
  onBack: () => void;
};

export function SurahDetailView({
  surahNumber,
  surahName,
  onBack,
}: SurahDetailViewProps) {
  const { data: arabicData, isLoading: loadingArabic, error: errorArabic } = useSurahArabic(surahNumber);
  const { data: albanianVerses, isLoading: loadingAlbanian, error: errorAlbanian } = useSurahTranslation(surahNumber);

  const verses = useMemo(() => {
    if (!arabicData?.ayahs?.length || !albanianVerses?.length) return [];
    const byAya = new Map(albanianVerses.map((v) => [v.aya, v]));
    return arabicData.ayahs.map((a) => ({
      aya: a.numberInSurah,
      arabic: a.text.trim(),
      albanian: byAya.get(a.numberInSurah)?.translation ?? "",
    }));
  }, [arabicData, albanianVerses]);

  const isLoading = loadingArabic || loadingAlbanian;
  const error = errorArabic || errorAlbanian;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={QURAN_HEADER_GRADIENT} style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={12}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>{surahName}</Text>
        </LinearGradient>
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color={QURAN_PRIMARY} />
          <Text style={styles.loadingText}>Duke ngarkuar...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={QURAN_HEADER_GRADIENT} style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={12}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>{surahName}</Text>
        </LinearGradient>
        <View style={styles.centerWrap}>
          <Text style={styles.errorText}>Nuk u ngarkuan vargjet. Provoni përsëri.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={QURAN_HEADER_GRADIENT} style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={12}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {surahName}
          </Text>
          <Text style={styles.subtitle}>
            Arabisht · Përkthim shqip
          </Text>
        </View>
      </LinearGradient>

      <FlatList
        data={verses}
        keyExtractor={(item) => `${surahNumber}-${item.aya}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <VerseCard
            aya={item.aya}
            arabic={item.arabic}
            albanian={item.albanian}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginTop: 2,
  },
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: "#64748B",
  },
  errorText: {
    fontSize: 15,
    color: "#DC2626",
    textAlign: "center",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 20,
  },
});
