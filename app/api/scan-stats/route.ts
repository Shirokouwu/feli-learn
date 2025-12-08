import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { createServer } from "@/utils/supabase/server";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// GET: Fetch global scan stats
export async function GET() {
    try {
        const todayKey = `scan:global:today:${format(new Date(), "yyyy-MM-dd", { locale: id })}`;
        const totalKey = "scan:global:total";

        console.log(`[Scan Stats] GET request at ${new Date().toISOString()} - Fetching global stats for key: ${todayKey}`);

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

// POST: Increment global AND per-user scan counter
export async function POST(request: Request) {
    try {
        const supabase = await createServer();
        const { data: { user } } = await supabase.auth.getUser();

        const today = format(new Date(), "yyyy-MM-dd", { locale: id });

        // Global keys
        const globalTodayKey = `scan:global:today:${today}`;
        const globalTotalKey = "scan:global:total";

        // Per-user keys (if authenticated)
        let userTodayKey: string | null = null;
        let userTotalKey: string | null = null;

        if (user) {
            userTodayKey = `scan:user:${user.id}:today:${today}`;
            userTotalKey = `scan:user:${user.id}:total`;
        }

        console.log(`🔥 [Scan Stats] POST request at ${new Date().toISOString()}`);
        console.log(`   User: ${user ? user.id : 'guest'}`);

        // Get current values before increment for logging
        const [currentGlobalToday, currentGlobalTotal] = await redis.mget<number[]>([globalTodayKey, globalTotalKey]);

        // Increment global counters
        await redis.incr(globalTodayKey);
        await redis.incr(globalTotalKey);

        // Increment per-user counters if authenticated
        if (user && userTodayKey && userTotalKey) {
            const [currentUserToday, currentUserTotal] = await redis.mget<number[]>([userTodayKey, userTotalKey]);

            await redis.incr(userTodayKey);
            await redis.incr(userTotalKey);

            const [newUserToday, newUserTotal] = await redis.mget<number[]>([userTodayKey, userTotalKey]);

            console.log(`👤 [User Stats] Today: ${currentUserToday || 0} → ${newUserToday}, Total: ${currentUserTotal || 0} → ${newUserTotal}`);
        }

        // Get new global values after increment
        const [newGlobalToday, newGlobalTotal] = await redis.mget<number[]>([globalTodayKey, globalTotalKey]);

        console.log(`🌍 [Global Stats] Today: ${currentGlobalToday || 0} → ${newGlobalToday}, Total: ${currentGlobalTotal || 0} → ${newGlobalTotal}`);

        return NextResponse.json({
            message: "Scan recorded",
            userId: user?.id || null
        });
    } catch (error) {
        console.error(`❌ [Scan Stats] POST error:`, error);
        return NextResponse.json(
            { error: "Failed to record scan" },
            { status: 500 }
        );
    }
}
