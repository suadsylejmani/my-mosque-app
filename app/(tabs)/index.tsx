import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Calendar,
  Clock,
  MapPin,
  MoonStar,
  Sun,
  Sunrise,
  Sunset,
} from "lucide-react-native";

import usePrayerTimes, { PrayerTime as ApiPrayerTime } from "@/hooks/use-prayer-times";

interface HomePageProps {
  onNavigate: (section: string) => void;
}

type PrayerTime = {
  name: string;
  time: string;
  icon: React.ElementType;
  isPast?: boolean;
  isNext?: boolean;
};

const PRAYER_ICON_MAP: Record<string, React.ElementType> = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: MoonStar,
};

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

function getTodayEntry(apiData: ApiPrayerTime[] | undefined): ApiPrayerTime | null {
  if (!apiData?.length) return null;
  const d = new Date();
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return apiData.find((e) => e.date === todayStr) ?? apiData[0];
}

function getNextPrayerDate(apiData: ApiPrayerTime[] | undefined): Date | null {
  const entry = getTodayEntry(apiData);
  if (!entry) return null;
  const now = new Date();
  for (const prayer of PRAYER_ORDER) {
    const timeStr = entry[prayer.toLowerCase() as keyof ApiPrayerTime] as string;
    if (!timeStr) continue;
    const date = new Date(entry.date + "T" + timeStr);
    if (date > now) return date;
  }
  return null;
}

function formatPrayerTimes(apiData: ApiPrayerTime[] | undefined): PrayerTime[] {
  const entry = getTodayEntry(apiData);
  if (!entry) return [];
  const now = new Date();
  let nextFound = false;
  return PRAYER_ORDER.map((prayer) => {
    const timeStr = entry[prayer.toLowerCase() as keyof ApiPrayerTime] as string;
    // Convert to 12-hour format
    const date = new Date(entry.date + "T" + timeStr);
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const isPast = now > date;
    let isNext = false;
    if (!nextFound && !isPast) {
      isNext = true;
      nextFound = true;
    }
    return {
      name: prayer,
      time,
      icon: PRAYER_ICON_MAP[prayer],
      isPast,
      isNext,
    };
  }).filter(Boolean) as PrayerTime[];
}

type CountdownParts = { h: number; m: number; s: number } | null;

function getCountdownParts(ms: number): CountdownParts {
  if (ms <= 0) return null;
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return { h, m, s };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

const { width } = Dimensions.get("window");

export default function HomeScreen({ onNavigate }: HomePageProps) {
  
  const dateString = useMemo(() => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const hijriDate = "15 Rajab 1447"; // Mock Hijri date

  const { data: apiPrayerTimes } = usePrayerTimes();
  const prayerTimes = formatPrayerTimes(apiPrayerTimes);
  const nextPrayer = prayerTimes.find((p) => p.isNext);
  const nextPrayerDate = useMemo(() => getNextPrayerDate(apiPrayerTimes), [apiPrayerTimes]);

  const [countdown, setCountdown] = useState<CountdownParts>(null);
  useEffect(() => {
    if (!nextPrayerDate) {
      setCountdown(null);
      return;
    }
    const tick = () => {
      const left = nextPrayerDate.getTime() - Date.now();
      setCountdown(getCountdownParts(left));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextPrayerDate]);

  const CARD_GAP = 12;
  const SLIDE_VISIBLE = 3;
  const SLIDE_WIDTH = (width - 16 * 2 - CARD_GAP * (SLIDE_VISIBLE - 1)) / SLIDE_VISIBLE;

  return (
    <LinearGradient colors={["#ECFDF5", "#FFFFFF"]} style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#059669", "#047857"]}
        style={styles.header}
      >
        <View style={styles.rowCenter}>
          <MapPin size={16} color="white" />
          <Text style={styles.headerSmallText}>Xhamia e Madhe Koretin</Text>
        </View>

        <Text style={styles.headerTitle}>As-salamu alaykum</Text>

        <View style={[styles.rowCenter, { marginTop: 6 }]}>
          <Calendar size={16} color="white" />
          <Text style={styles.headerSmallText}>{dateString}</Text>
        </View>

        <Text style={[styles.headerSmallText, { marginTop: 6 }]}>
          {new Date().toLocaleDateString("albanian", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Next Prayer Card */}
        {nextPrayer && (
          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={styles.nextPrayerCard}
          >
            <View style={[styles.rowCenter, { marginBottom: 10 }]}>
              <Clock size={18} color="white" />
              <Text style={styles.nextPrayerLabel}>Koha e Ardhshme e Namazit</Text>
            </View>

            <View style={styles.nextPrayerRow}>
              <View style={styles.nextPrayerLeft}>
                <nextPrayer.icon size={48} color="white" />
                <View>
                  <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
                  <View style={styles.nextPrayerCountdownRow}>
                    {countdown != null ? (
                      <>
                        {/* <Text style={styles.nextPrayerCountdownPrefix}></Text> */}
                        <Text style={styles.nextPrayerCountdownMain}>
                          {pad2(countdown.h)}:{pad2(countdown.m)}
                        </Text>
                        <Text style={styles.nextPrayerCountdownSeconds}>
                          :{pad2(countdown.s)}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.nextPrayerCountdownMain}>—</Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.nextPrayerTimeWrap}>
                <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
                <Text style={styles.nextPrayerTimeLabel}>Koha e namazit</Text>
              </View>
            </View>
          </LinearGradient>
        )}

        {/* Prayer Times Slider (FlatList horizontal) */}
        <View style={{ marginTop: 18 }}>
          <Text style={styles.sectionTitle}>Kohët e Namazit</Text>

          <FlatList
            data={prayerTimes}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            snapToInterval={SLIDE_WIDTH + CARD_GAP}
            decelerationRate="fast"
            ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
            renderItem={({ item }) => {
              const IconComponent = item.icon;

              const cardStyle = [
                styles.prayerCard,
                { width: SLIDE_WIDTH },
                item.isNext && styles.prayerCardNext,
                item.isPast && styles.prayerCardPast,
              ];

              const iconColor = item.isNext
                ? "#059669"
                : item.isPast
                ? "#9CA3AF"
                : "#4B5563";

              const timeColor = item.isNext
                ? "#047857"
                : item.isPast
                ? "#9CA3AF"
                : "#111827";

              const nameColor = item.isNext
                ? "#059669"
                : item.isPast
                ? "#9CA3AF"
                : "#4B5563";

              return (
                <View style={cardStyle}>
                  <IconComponent size={28} color={iconColor} />
                  <Text style={[styles.prayerTimeText, { color: timeColor }]}>
                    {item.time}
                  </Text>
                  <Text style={[styles.prayerNameText, { color: nameColor }]}>
                    {item.name}
                  </Text>
                </View>
              );
            }}
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <LinearGradient colors={["#EFF6FF", "#DBEAFE"]} style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#2563EB" }]}>30</Text>
            <Text style={[styles.statLabel, { color: "#1D4ED8" }]}>
              Juzi i Lexuar
            </Text>
          </LinearGradient>

          <LinearGradient colors={["#F5F3FF", "#EDE9FE"]} style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#7C3AED" }]}>247</Text>
            <Text style={[styles.statLabel, { color: "#6D28D9" }]}>
              Dhikr Counti
            </Text>
          </LinearGradient>

          <LinearGradient colors={["#FFFBEB", "#FEF3C7"]} style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#D97706" }]}>12</Text>
            <Text style={[styles.statLabel, { color: "#B45309" }]}>
              Hadithe të Lexuara
            </Text>
          </LinearGradient>
        </View>

        {/* Daily Reminder */}
        <LinearGradient
          colors={["#EEF2FF", "#F5F3FF"]}
          style={styles.reminderCard}
        >
          <Text style={styles.reminderTitle}>Kujtim Ditore</Text>
          <Text style={styles.reminderQuote}>
            “Indeed, prayer prohibits immorality and wrongdoing, and the remembrance
            of Allah is greater.”
          </Text>
          <Text style={styles.reminderRef}>— Surah Al-Ankabut (29:45)</Text>
        </LinearGradient>
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

  content: {
    paddingVertical: 20,
    paddingBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  nextPrayerCard: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  nextPrayerLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.9,
    marginLeft: 6,
  },

  nextPrayerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  nextPrayerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  nextPrayerName: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
  },

  nextPrayerCountdownRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  nextPrayerCountdownPrefix: {
    color: "white",
    opacity: 0.9,
    fontSize: 16,
    marginRight: 2,
  },
  nextPrayerCountdownMain: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1,
  },
  nextPrayerCountdownSeconds: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
    marginLeft: 2,
  },

  nextPrayerTimeWrap: {
    alignItems: "flex-end",
  },
  nextPrayerTime: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
  },
  nextPrayerTimeLabel: {
    color: "white",
    opacity: 0.85,
    fontSize: 12,
    marginTop: 2,
  },

  prayerCard: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  prayerCardNext: {
    backgroundColor: "#D1FAE5",
    borderWidth: 2,
    borderColor: "#10B981",
  },

  prayerCardPast: {
    backgroundColor: "#F9FAFB",
    opacity: 0.6,
  },

  prayerTimeText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "800",
  },

  prayerNameText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },

  statsGrid: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 20,
  },

  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "800",
  },

  statLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "600",
  },

  reminderCard: {
    marginTop: 18,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
  },

  reminderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  reminderQuote: {
    fontSize: 13,
    color: "#4B5563",
    fontStyle: "italic",
    lineHeight: 18,
  },

  reminderRef: {
    marginTop: 8,
    fontSize: 11,
    color: "#6B7280",
  },
});