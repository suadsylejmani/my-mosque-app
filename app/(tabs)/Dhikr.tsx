import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

import { HandMetal, Plus, RotateCcw } from "lucide-react-native";

const dhikrList = [
  {
    id: 1,
    arabic: "سُبْحَانَ اللهِ",
    transliteration: "SubhanAllah",
    translation: "Glory be to Allah",
    target: 33,
  },
  {
    id: 2,
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah",
    translation: "All praise is due to Allah",
    target: 33,
  },
  {
    id: 3,
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    translation: "Allah is the Greatest",
    target: 34,
  },
  {
    id: 4,
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    transliteration: "La ilaha illallah",
    translation: "There is no god but Allah",
    target: 100,
  },
  {
    id: 5,
    arabic: "أَسْتَغْفِرُ اللهَ",
    transliteration: "Astaghfirullah",
    translation: "I seek forgiveness from Allah",
    target: 100,
  },
];

type Dhikr = (typeof dhikrList)[number];

export default function DhikrScreen() {
  const [selectedDhikr, setSelectedDhikr] = useState<Dhikr>(dhikrList[0]);
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleReset = () => setCount(0);

  const progress = useMemo(() => {
    return Math.min((count / selectedDhikr.target) * 100, 100);
  }, [count, selectedDhikr.target]);

  const remaining = Math.max(0, selectedDhikr.target - count);

  // Progress ring values
  const SIZE = 190;
  const STROKE = 10;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;
  const dashOffset = C * (1 - progress / 100);

  return (
    <LinearGradient colors={["#FAF5FF", "#FFFFFF"]} style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#7C3AED", "#6D28D9"]} style={styles.header}>
        <View style={styles.headerRow}>
          <HandMetal size={28} color="white" />
          <Text style={styles.headerTitle}>Dhikr Counter</Text>
        </View>
        <Text style={styles.headerSubtitle}>Remember Allah with every breath</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Counter Card */}
        <View style={styles.card}>
          <View style={{ alignItems: "center", marginBottom: 18 }}>
            <Text style={styles.arabicText}>{selectedDhikr.arabic}</Text>

            <Text style={styles.transliterationText}>
              {selectedDhikr.transliteration}
            </Text>

            <Text style={styles.translationText}>{selectedDhikr.translation}</Text>
          </View>

          {/* Counter Circle */}
          <View style={styles.counterWrap}>
            <LinearGradient
              colors={["#F3E8FF", "#E9D5FF"]}
              style={styles.counterCircle}
            >
              <Text style={styles.countNumber}>{count}</Text>
            </LinearGradient>

            {/* Progress Ring (overlay) */}
            <View style={styles.ringOverlay} pointerEvents="none">
              <Svg width={SIZE} height={SIZE}>
                {/* Track */}
                <Circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={R}
                  stroke="#E9D5FF"
                  strokeWidth={STROKE}
                  fill="none"
                />
                {/* Progress */}
                <Circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={R}
                  stroke="#7C3AED"
                  strokeWidth={STROKE}
                  fill="none"
                  strokeDasharray={C}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  rotation={-90}
                  originX={SIZE / 2}
                  originY={SIZE / 2}
                />
              </Svg>
            </View>
          </View>

          <Text style={styles.targetText}>
            Target: {selectedDhikr.target} • Remaining: {remaining}
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <Pressable onPress={handleReset} style={styles.resetButton}>
              <RotateCcw size={18} color="#6D28D9" />
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>

            <Pressable onPress={handleIncrement} style={styles.countButton}>
              <LinearGradient
                colors={["#7C3AED", "#6D28D9"]}
                style={styles.countButtonGradient}
              >
                <Plus size={18} color="white" />
                <Text style={styles.countButtonText}>Count</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {/* Dhikr List */}
        <Text style={styles.selectTitle}>Select Dhikr</Text>

        <View style={{ gap: 12 }}>
          {dhikrList.map((dhikr) => {
            const isActive = selectedDhikr.id === dhikr.id;

            return (
              <TouchableOpacity
                key={dhikr.id}
                activeOpacity={0.85}
                onPress={() => {
                  setSelectedDhikr(dhikr);
                  setCount(0);
                }}
                style={[
                  styles.listCard,
                  isActive ? styles.listCardActive : styles.listCardNormal,
                ]}
              >
                {isActive ? (
                  <LinearGradient
                    colors={["#A855F7", "#7C3AED"]}
                    style={styles.listCardGradient}
                  >
                    <View style={styles.listCardRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.listArabic, { color: "white" }]}>
                          {dhikr.arabic}
                        </Text>
                        <Text style={[styles.listTranslit, { color: "#EDE9FE" }]}>
                          {dhikr.transliteration}
                        </Text>
                      </View>

                      <Text style={[styles.listTarget, { color: "#EDE9FE" }]}>
                        ×{dhikr.target}
                      </Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.listCardRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listArabic}>{dhikr.arabic}</Text>
                      <Text style={styles.listTranslit}>{dhikr.transliteration}</Text>
                    </View>
                    <Text style={styles.listTarget}>×{dhikr.target}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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

  content: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 18,
  },

  arabicText: {
    fontSize: 40,
    color: "#111827",
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: 8,
  },

  transliterationText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#7C3AED",
    marginBottom: 4,
  },

  translationText: {
    fontSize: 13,
    color: "#4B5563",
    textAlign: "center",
  },

  counterWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  counterCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    alignItems: "center",
    justifyContent: "center",
  },

  countNumber: {
    fontSize: 56,
    fontWeight: "800",
    color: "#6D28D9",
  },

  ringOverlay: {
    position: "absolute",
    width: 190,
    height: 190,
    alignItems: "center",
    justifyContent: "center",
  },

  targetText: {
    textAlign: "center",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 10,
    marginBottom: 16,
    fontWeight: "500",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },

  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#D8B4FE",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#FAF5FF",
  },

  resetButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6D28D9",
  },

  countButton: {
    borderRadius: 999,
    overflow: "hidden",
  },

  countButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
  },

  countButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },

  selectTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
    paddingHorizontal: 4,
  },

  listCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },

  listCardNormal: {
    backgroundColor: "white",
  },

  listCardActive: {
    backgroundColor: "transparent",
  },

  listCardGradient: {
    padding: 14,
  },

  listCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },

  listArabic: {
    fontSize: 18,
    color: "#111827",
    writingDirection: "rtl",
    marginBottom: 4,
  },

  listTranslit: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
  },

  listTarget: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
  },
});
