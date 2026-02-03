import { API_URL } from "@/constants/constants";
import { useQuery } from "@tanstack/react-query";

// Define the type for a single prayer time entry
export type PrayerTime = {
    id: number;
    date: string;
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    jumuah: string | null;
    notes: string;
};

function getDateRange(daysAhead: number = 30): { start: string; end: string } {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + daysAhead);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return { start: fmt(start), end: fmt(end) };
}

export default function usePrayerTimes() {
    const { start, end } = getDateRange(30);
    return useQuery<PrayerTime[]>({
        queryKey: ['prayer-times', start, end],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/prayer-times/range?start=${start}&end=${end}`);
            if (!response.ok) throw new Error('Failed to fetch prayer times');
            return response.json();
        },
    });
}