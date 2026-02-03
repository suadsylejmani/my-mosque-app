import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Bell, BookMarked, BookOpen, Compass, HandMetal, Home } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,

        // ✅ MATCH your old tab colors
        tabBarActiveTintColor: "#059669",   // emerald-600
        tabBarInactiveTintColor: "#9CA3AF", // gray-400

        tabBarStyle: {
          height: 78,
          paddingTop: 10,
          paddingBottom: 16,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home size={26} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="Quran"
        options={{
          title: "Quran",
          tabBarIcon: ({ color, focused }) => (
            <BookOpen size={26} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="Qibla"
        options={{
          title: "Qibla",
          tabBarIcon: ({ color, focused }) => (
            <Compass size={26} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="Dhikr"
        options={{
          title: "Dhikr",
          tabBarIcon: ({ color, focused }) => (
            <HandMetal size={26} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="Hadith"
        options={{
          title: "Hadith",
          tabBarIcon: ({ color, focused }) => (
            <BookMarked size={26} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="News"
        options={{
          title: "News",
          tabBarIcon: ({ color, focused }) => (
            <Bell size={26} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
