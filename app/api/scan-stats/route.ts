import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
    try {
        const todayKey = `scan:today:${format(new Date(), "yyyy-MM-dd", { locale: id })}`;
        const totalKey = "scan:total";

        console.log(`[Scan Stats] GET request at ${new Date().toISOString()} - Fetching stats for key: ${todayKey}`);

        const [todayScans, totalScans] = await redis.mget<number[]>([todayKey, totalKey]);

        const response = {
            todayScans: todayScans || 0,
            totalScans: totalScans || 0,
        };

        console.log(`[Scan Stats] GET response:`, response);

        return NextResponse.json(response);
    } catch (error) {
        console.error(`[Scan Stats] GET error:`, error);
        return NextResponse.json(
            { error: "Failed to fetch scan stats" },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        const todayKey = `scan:today:${format(new Date(), "yyyy-MM-dd", { locale: id })}`;
        const totalKey = "scan:total";

        console.log(`🔥 [Scan Stats] POST request at ${new Date().toISOString()} - Incrementing counters for key: ${todayKey}`);

        // Get current values before increment for logging
        const [currentTodayScans, currentTotalScans] = await redis.mget<number[]>([todayKey, totalKey]);

        await redis.incr(todayKey);
        await redis.incr(totalKey);

        // Get new values after increment
        const [newTodayScans, newTotalScans] = await redis.mget<number[]>([todayKey, totalKey]);

        console.log(`🔥 [Scan Stats] POST success - Today: ${currentTodayScans || 0} → ${newTodayScans}, Total: ${currentTotalScans || 0} → ${newTotalScans}`);

        return NextResponse.json({ message: "Scan recorded" });
    } catch (error) {
        console.error(`❌ [Scan Stats] POST error:`, error);
        return NextResponse.json(
            { error: "Failed to record scan" },
            { status: 500 }
        );
    }
}
