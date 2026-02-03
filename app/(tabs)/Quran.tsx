import { SurahDetailView, SurahList } from "@/components/quran";
import { useSurahsMeta } from "@/hooks/use-quran";
import React, { useMemo, useState } from "react";

export default function QuranScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);

  const { data: surahsMeta = [], isLoading: loadingSurahs } = useSurahsMeta();

  const filteredSurahs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return surahsMeta;
    return surahsMeta.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.translation.toLowerCase().includes(term)
    );
  }, [surahsMeta, searchTerm]);

  const selectedSurah = selectedSurahNumber != null
    ? surahsMeta.find((s) => s.number === selectedSurahNumber)
    : null;
  const surahName = selectedSurah
    ? `${selectedSurah.name} (${selectedSurah.translation})`
    : "Surah";

  if (selectedSurahNumber != null) {
    return (
      <SurahDetailView
        surahNumber={selectedSurahNumber}
        surahName={surahName}
        onBack={() => setSelectedSurahNumber(null)}
      />
    );
  }

  return (
    <SurahList
      surahs={filteredSurahs}
      isLoading={loadingSurahs}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onSurahPress={setSelectedSurahNumber}
    />
  );
}
