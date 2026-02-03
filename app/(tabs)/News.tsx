import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";

import { AlertCircle, Bell, Gift, Heart, Info } from "lucide-react-native";

type NewsItem = {
  id: number;
  type: "urgent" | "charity" | "event" | "announcement";
  category: string;
  title: string;
  message: string;
  time: string;
  icon: React.ElementType;
  color: "red" | "pink" | "purple" | "blue" | "emerald" | "indigo";
};

const news: NewsItem[] = [
  {
    id: 1,
    type: "urgent",
    category: "Death Announcement",
    title: "Funeral Announcement",
    message:
      "With deep sadness, we announce the passing of Brother Ahmed Hassan. Burial will take place after Asr prayer today at the community cemetery. May Allah grant him Jannah.",
    time: "2 hours ago",
    icon: AlertCircle,
    color: "red",
  },
  {
    id: 2,
    type: "charity",
    category: "Charity Drive",
    title: "Food Distribution for Families",
    message:
      "This Saturday, we will be distributing food packages to families in need. Volunteers needed from 9 AM to 2 PM. Please contact the mosque office to help.",
    time: "5 hours ago",
    icon: Heart,
    color: "pink",
  },
  {
    id: 3,
    type: "event",
    category: "Community Event",
    title: "Eid Gifts for Children",
    message:
      "Eid is approaching! We will distribute gifts to all children of the community on the day of Eid after Salah. Parents, please register your children at the mosque.",
    time: "1 day ago",
    icon: Gift,
    color: "purple",
  },
  {
    id: 4,
    type: "announcement",
    category: "Ramadan Schedule",
    title: "Taraweeh Prayer Timing",
    message:
      "Taraweeh prayers will begin 30 minutes after Isha throughout Ramadan. Brothers and sisters are encouraged to attend. Quran recitation will complete in 30 days insha'Allah.",
    time: "2 days ago",
    icon: Bell,
    color: "blue",
  },
  {
    id: 5,
    type: "charity",
    category: "Zakat Collection",
    title: "Zakat Distribution Program",
    message:
      "The mosque is collecting Zakat to help poor families in our village. Your contributions will directly support widows, orphans, and those in financial hardship.",
    time: "3 days ago",
    icon: Heart,
    color: "emerald",
  },
  {
    id: 6,
    type: "announcement",
    category: "Community Notice",
    title: "New Islamic Classes",
    message:
      "Weekly Islamic classes for adults starting next Monday at 7 PM. Topics include Fiqh, Seerah, and Quran Tafseer. All are welcome to attend.",
    time: "4 days ago",
    icon: Info,
    color: "indigo",
  },
  {
    id: 7,
    type: "urgent",
    category: "Death Announcement",
    title: "Condolences",
    message:
      "We extend our condolences to the family of Sister Fatima Ali who passed away yesterday. Janazah prayer will be held after Dhuhr tomorrow. May Allah have mercy on her soul.",
    time: "5 days ago",
    icon: AlertCircle,
    color: "red",
  },
];

type ColorTheme = {
  bg: string;
  border: string;
  iconBg: string;
  icon: string;
  badge: string;
  title: string;
  ring?: string;
};

function getTheme(color: NewsItem["color"], isUrgent: boolean): ColorTheme {
  if (isUrgent) {
    return {
      bg: "#FEF2F2",
      border: "#FECACA",
      iconBg: "#FEE2E2",
      icon: "#DC2626",
      badge: "#EF4444",
      title: "#7F1D1D",
      ring: "#FCA5A5",
    };
  }

  const map: Record<NewsItem["color"], ColorTheme> = {
    pink: {
      bg: "#FDF2F8",
      border: "#FBCFE8",
      iconBg: "#FCE7F3",
      icon: "#DB2777",
      badge: "#EC4899",
      title: "#831843",
    },
    purple: {
      bg: "#FAF5FF",
      border: "#E9D5FF",
      iconBg: "#F3E8FF",
      icon: "#7C3AED",
      badge: "#A855F7",
      title: "#4C1D95",
    },
    blue: {
      bg: "#EFF6FF",
      border: "#BFDBFE",
      iconBg: "#DBEAFE",
      icon: "#2563EB",
      badge: "#3B82F6",
      title: "#1E3A8A",
    },
    emerald: {
      bg: "#ECFDF5",
      border: "#A7F3D0",
      iconBg: "#D1FAE5",
      icon: "#059669",
      badge: "#10B981",
      title: "#064E3B",
    },
    indigo: {
      bg: "#EEF2FF",
      border: "#C7D2FE",
      iconBg: "#E0E7FF",
      icon: "#4F46E5",
      badge: "#6366F1",
      title: "#312E81",
    },
    red: {
      bg: "#FEF2F2",
      border: "#FECACA",
      iconBg: "#FEE2E2",
      icon: "#DC2626",
      badge: "#EF4444",
      title: "#7F1D1D",
    },
  };

  return map[color] || map.blue;
}

export default function NewsScreen() {
  const hasNews = news.length > 0;

  return (
    <LinearGradient colors={["#F0F9FF", "#FFFFFF"]} style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#0284C7", "#0369A1"]} style={styles.header}>
        <View style={styles.headerRow}>
          <Bell size={28} color="white" />
          <Text style={styles.headerTitle}>Community News</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Stay updated with community announcements
        </Text>
      </LinearGradient>

      {/* List */}
      {hasNews ? (
        <FlatList
          data={news}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <NewsCard item={item} />}
        />
      ) : (
        <EmptyState />
      )}
    </LinearGradient>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const isUrgent = item.type === "urgent";
  const theme = useMemo(() => getTheme(item.color, isUrgent), [item.color, isUrgent]);
  const IconComponent = item.icon;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.bg,
          borderColor: theme.border,
        },
        isUrgent && styles.urgentCard,
        isUrgent && theme.ring ? { shadowColor: theme.ring } : null,
      ]}
    >
      <View style={styles.cardRow}>
        <View style={[styles.iconCircle, { backgroundColor: theme.iconBg }]}>
          <IconComponent size={22} color={theme.icon} />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.topRow}>
            <View style={[styles.badge, { backgroundColor: theme.badge }]}>
              <Text style={styles.badgeText}>{item.category}</Text>
            </View>

            <Text style={styles.timeText}>{item.time}</Text>
          </View>

          <Text style={[styles.titleText, { color: theme.title }]}>
            {item.title}
          </Text>

          <Text style={styles.messageText}>{item.message}</Text>
        </View>
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyWrap}>
      <Bell size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No announcements yet</Text>
      <Text style={styles.emptySubtitle}>
        Check back later for community updates
      </Text>
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

  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    paddingBottom: 24,
    gap: 14,
  },

  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  urgentCard: {
    // extra emphasis for urgent cards
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
  },

  cardRow: {
    flexDirection: "row",
    gap: 12,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  cardBody: {
    flex: 1,
    minWidth: 0,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },

  timeText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  titleText: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },

  messageText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
  },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "800",
    color: "#4B5563",
  },

  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
});
